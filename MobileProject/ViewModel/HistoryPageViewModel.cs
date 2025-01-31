using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Repository;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class HistoryPageViewModel : BaseViewModel
    {
        private readonly OrderRepository _orderRepository;
        private readonly CartRecordRepository _cartRecordRepository;
        private readonly ProductRepository _productRepository;

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

        public HistoryPageViewModel()
        {
            _orderRepository = new OrderRepository();
            _cartRecordRepository = new CartRecordRepository();
            _productRepository = new ProductRepository();

            Orders = new ObservableCollection<Order>();
            SelectedOrderDetails = new ObservableCollection<Cart>();

            SearchCommand = new Command(async () => await LoadOrdersAsync());

            _ = LoadOrdersAsync();
        }

        private async Task LoadOrdersAsync()
        {
            var userIdString = await SecureStorageHelper.GetUserIdAsync();

            if (!int.TryParse(userIdString, out int userId))
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Failed to retrieve user ID.", "OK");
                return;
            }

            var transactionCodes = _cartRecordRepository
                .GetFilteredCartRecord(status: "paid", userId: userId)
                .Select(x => x.TransactionCode)
                .Distinct()
                .ToList();

            if (!transactionCodes.Any())
            {
                await Application.Current.MainPage.DisplayAlert("Info", "No orders found for this user.", "OK");
                return;
            }

            var orders = _orderRepository.GetFilteredOrders(transactionCodes, TransactionCode, DateFrom, DateTo);
            Orders = new ObservableCollection<Order>(orders);
        }

        private async void LoadOrderDetails()
        {
            if (SelectedOrder == null) return;

            var cartRecords = _cartRecordRepository
                .GetFilteredCartRecord(status: "paid", transactionCode: SelectedOrder.TransactionCode)
                .ToList();

            SelectedOrderDetails.Clear();

            foreach (var cartRecord in cartRecords)
            {
                var products = await _productRepository.GetFilteredProductsAsync(productId: cartRecord.ProductId);
                var product = products.FirstOrDefault();

                if (product != null)
                {
                    SelectedOrderDetails.Add(new Cart(cartRecord, product));
                }
            }
        }
    }
}