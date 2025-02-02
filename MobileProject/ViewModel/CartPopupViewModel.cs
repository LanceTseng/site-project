using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Model;
using MobileProject.Service;
using MobileProject.Service.Interface;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class CartPopupViewModel : BaseViewModel
    {
        private readonly ApiService _apiService;
        private readonly ICartRecordService _cartRecordService;
        private readonly IOrderService _orderService;

        private ObservableCollection<CartMgmt> _cartItems;

        public ObservableCollection<CartMgmt> CartItems
        {
            get => _cartItems;
            set
            {
                _cartItems = value;
                OnPropertyChanged();

                TransactionCode = value.FirstOrDefault()?.CartRecord.TransactionCode;
            }
        }

        private string _transactionCode;

        public string TransactionCode
        {
            get => _transactionCode;
            set
            {
                _transactionCode = value;
                OnPropertyChanged();
            }
        }

        public ICommand SaveDetailCommand { get; set; }
        public ICommand CloseCommand { get; set; }

        public CartPopupViewModel(List<CartMgmt> carts, ApiService apiService, ICartRecordService cartRecordService, IOrderService orderService)
        {
            _apiService = apiService;
            _orderService = orderService;
            _cartRecordService = cartRecordService;

            CartItems = new ObservableCollection<CartMgmt>(carts);

            CloseCommand = new Command(async () => await OnClosePopup());  // Call OnClosePopup as a method
            SaveDetailCommand = new Command(async () => await OnSaveDetail());  // Pass the argument correctly
        }

        private async Task OnClosePopup()
        {
            await Rg.Plugins.Popup.Services.PopupNavigation.Instance.PopAsync();
        }

        private async Task OnSaveDetail()
        {
            foreach (var cart in CartItems)
            {
                if (cart.CartRecord != null)
                {
                    await _cartRecordService.UpdateCartRecordAsync(cart.CartRecord);
                }
                else
                {
                    Debug.WriteLine("CartRecord is null.");
                }
            }

            var orders = await _orderService.GetOrdersByConditionAsync(transactionCode: TransactionCode);
            foreach (var order in orders.ToList())
            {
                order.Subtotal = CartItems.Sum(x => x.CartRecord.Total);
                await _orderService.UpdateOrderAsync(order);
            }
            await Rg.Plugins.Popup.Services.PopupNavigation.Instance.PopAsync();
        }
    }
}