using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Service;
using MobileProject.Service.Interface;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class HistoryPageViewModel : BaseViewModel
    {
        private readonly ApiService _apiService;
        private readonly IOrderService _orderService;
        private readonly IProductService _productService;
        private readonly ICartRecordService _cartRecordService;

        private ObservableCollection<Order> _orders;
        private ObservableCollection<Cart> _selectedOrderDetails;
        private Order _selectedOrder;

        private DateTime _dateFrom = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
        private DateTime _dateTo = DateTime.Today;
        private string _transactionCode;

        public ObservableCollection<Order> Orders
        {
            get => _orders;
            set => SetProperty(ref _orders, value);
        }

        public ObservableCollection<Cart> SelectedOrderDetails
        {
            get => _selectedOrderDetails;
            set => SetProperty(ref _selectedOrderDetails, value);
        }

        public Order SelectedOrder
        {
            get => _selectedOrder;
            set
            {
                SetProperty(ref _selectedOrder, value);
                LoadOrderDetails();
            }
        }

        public DateTime DateFrom
        {
            get => _dateFrom;
            set => SetProperty(ref _dateFrom, value);
        }

        public DateTime DateTo
        {
            get => _dateTo;
            set => SetProperty(ref _dateTo, value);
        }

        public string TransactionCode
        {
            get => _transactionCode;
            set => SetProperty(ref _transactionCode, value);
        }

        public ICommand SearchCommand { get; }

        public HistoryPageViewModel(ApiService apiService, IProductService productService, ICartRecordService cartRecordService, IOrderService orderService)
        {
            _apiService = apiService;
            _productService = productService;
            _cartRecordService = cartRecordService;
            _orderService = orderService;

            Orders = new ObservableCollection<Order>();
            SelectedOrderDetails = new ObservableCollection<Cart>();

            SearchCommand = new Command(async () => await OnSearch());

            _ = LoadData();
        }

        private async Task LoadData()
        {
            var userIdString = await SecureStorageHelper.GetUserIdAsync();

            if (!int.TryParse(userIdString, out int userId))
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Failed to retrieve user ID.", "OK");
                return;
            }

            var orders = await _orderService.GetOrdersByConditionAsync(userId: userId);
            if (orders != null)
            {
                Orders = new ObservableCollection<Order>(orders);
            }
        }

        private async Task OnSearch()
        {
            Orders = new ObservableCollection<Order>();

            var userIdString = await SecureStorageHelper.GetUserIdAsync();

            if (!int.TryParse(userIdString, out int userId))
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Failed to retrieve user ID.", "OK");
                return;
            }

            var orders = await _orderService.GetOrdersByConditionAsync(userId: userId, transactionCode: TransactionCode,
                dateFrom: DateFrom, dateTo: DateTo);

            if (orders != null) Orders = new ObservableCollection<Order>(orders);
         
        }

        private async void LoadOrderDetails()
        {
            if (SelectedOrder == null) return;

            var cartRecords = await _cartRecordService.GetCartRecordsByConditionAsync(status: "paid",
                transactionCode: SelectedOrder.TransactionCode);

            SelectedOrderDetails = new ObservableCollection<Cart>();

            foreach (var cartRecord in cartRecords)
            {
                var product = await _productService.GetProductByIdAsync(cartRecord.ProductId);
                if (product != null)
                {
                    SelectedOrderDetails.Add(new Cart(cartRecord, product));
                }
            }
        }
    }
}