using System;
using System.Collections.ObjectModel;
using System.Linq;
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
        private readonly IOrderService _orderService;
        private readonly IProductService _productService;
        private readonly ICartRecordService _cartRecordService;

        private ObservableCollection<Order> _orders;
        private ObservableCollection<Cart> _selectedOrderDetails;
        private ObservableCollection<Cart> _filteredOrderDetails;
        private Order _selectedOrder;
        private string _searchText;

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
            set
            {
                SetProperty(ref _selectedOrderDetails, value);
                FilterProducts();
            }
        }

        public ObservableCollection<Cart> FilteredOrderDetails
        {
            get => _filteredOrderDetails;
            set => SetProperty(ref _filteredOrderDetails, value);
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

        public string SearchText
        {
            get => _searchText;
            set
            {
                SetProperty(ref _searchText, value);
                FilterProducts();
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
        public ICommand FilterProductCommand { get; }

        public HistoryPageViewModel(IProductService productService, ICartRecordService cartRecordService, IOrderService orderService)
        {
            _productService = productService;
            _cartRecordService = cartRecordService;
            _orderService = orderService;

            Orders = new ObservableCollection<Order>();
            SelectedOrderDetails = new ObservableCollection<Cart>();
            FilteredOrderDetails = new ObservableCollection<Cart>();

            SearchCommand = new Command(async () => await OnSearch());
            FilterProductCommand = new Command(FilterProducts);

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

            FilterProducts();
        }

        private void FilterProducts()
        {
            if (string.IsNullOrWhiteSpace(SearchText))
            {
                FilteredOrderDetails = new ObservableCollection<Cart>(SelectedOrderDetails);
            }
            else
            {
                var filtered = SelectedOrderDetails
                    .Where(c => c.Product.Name.IndexOf(SearchText, StringComparison.OrdinalIgnoreCase) >= 0)
                    .ToList();

                FilteredOrderDetails = new ObservableCollection<Cart>(filtered);
            }
        }
    }
}
