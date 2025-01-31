using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Windows.Input;
using MobileProject.Model;
using MobileProject.Repository;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class CartPopupViewModel : BaseViewModel
    {
        private readonly CartRecordRepository _cartRecordRepository;
        private readonly OrderRepository _orderRepository;

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

        public CartPopupViewModel(List<CartMgmt> carts)
        {
            _orderRepository = new OrderRepository();
            _cartRecordRepository = new CartRecordRepository();

            CartItems = new ObservableCollection<CartMgmt>(carts);

            CloseCommand = new Command(OnClosePopup);
            SaveDetailCommand = new Command<string>(OnSaveDetail);
        }

        private async void OnClosePopup()
        {
            await Rg.Plugins.Popup.Services.PopupNavigation.Instance.PopAsync();
        }


        private async void OnSaveDetail(string transactionCode)
        {
            foreach (var cart in CartItems)
            {
                if (cart.CartRecord != null)
                {
                    await _cartRecordRepository.UpdateAsync(cart.CartRecord);
                }
                else
                {
                    Debug.WriteLine("CartRecord is null.");
                }
            }

            var order = _orderRepository.GetFilteredOrder(transactionCode: transactionCode).FirstOrDefault();
            order.Subtotal = CartItems.Sum(x => x.Total);
            await _orderRepository.UpdateAsync(order);

            await Rg.Plugins.Popup.Services.PopupNavigation.Instance.PopAsync();
        }

    }
}