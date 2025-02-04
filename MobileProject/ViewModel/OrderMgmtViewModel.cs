using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Model;
using MobileProject.Service;
using MobileProject.Service.Interface;
using MobileProject.View.AdminView;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class OrderMgmtViewModel : BaseViewModel
    {
        private readonly IOrderService _orderService;
        private readonly IUserService _userService;
        private readonly IProductService _productService;
        private readonly ICartRecordService _cartRecordService;

        private DateTime _dateFrom = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);

        public DateTime DateFrom
        {
            get => _dateFrom;
            set => SetProperty(ref _dateFrom, value);
        }

        private DateTime _dateTo = DateTime.Today;

        public DateTime DateTo
        {
            get => _dateTo;
            set => SetProperty(ref _dateTo, value);
        }

        private string _transactionCode;

        public string TransactionCode
        {
            get => _transactionCode;
            set => SetProperty(ref _transactionCode, value);
        }

        private string _userName;

        public string UserName
        {
            get => _userName;
            set => SetProperty(ref _userName, value);
        }

        private ObservableCollection<OrderMgmt> _tableData;

        public ObservableCollection<OrderMgmt> TableData
        {
            get => _tableData;
            set => SetProperty(ref _tableData, value);
        }

        public ICommand SaveCommand { get; }
        public ICommand AddCommand { get; }
        public ICommand RemoveCommand { get; }
        public ICommand EditCommand { get; }
        public ICommand SearchCommand { get; }
        public ICommand SelectedAllCommand { get; }
        public ICommand ShowDetailCommand { get; set; }

        public OrderMgmtViewModel( IUserService userService, IProductService productService, ICartRecordService cartRecordService, IOrderService orderService)
        {
            _userService = userService;
            _productService = productService;
            _cartRecordService = cartRecordService;
            _orderService = orderService;

            AddCommand = new Command(async () => await OnAdd());
            EditCommand = new Command<OrderMgmt>(OnEdit);
            SaveCommand = new Command(async () => await OnSave());
            RemoveCommand = new Command(async () => await OnRemove());
            SelectedAllCommand = new Command(OnSelectedAll);
            SearchCommand = new Command(async () => await OnSearch());
            ShowDetailCommand = new Command<List<CartMgmt>>(OnShowOrderDetail);

            TableData = new ObservableCollection<OrderMgmt>();
            _ = LoadData();
        }

        private async Task LoadData()
        {
            var orderMgmtList = new List<OrderMgmt>();

            var users = await _userService.GetAllUsersAsync(); // Fetch all users
            var orders = await _orderService.GetAllOrdersAsync();

            foreach (var order in orders)
            {
                var user = users.FirstOrDefault(x => x.Id == order.UserId);

                var cartRecords = await
                    _cartRecordService.GetCartRecordsByConditionAsync(transactionCode: order.TransactionCode);

                var cartMgmtList = new List<CartMgmt>();
                if (cartRecords != null)
                {
                    foreach (var cart in cartRecords)
                    {
                        var product = await _productService.GetProductByIdAsync(cart.ProductId);
                        cartMgmtList.Add(new CartMgmt(product, user, cart));
                    }
                }

                var orderMgmt = new OrderMgmt(user, order, cartMgmtList);
                foreach (var u in users)
                {
                    orderMgmt.UserOptions.Add(new KeyValuePair<int, string>(u.Id, u.UserName));
                }

                orderMgmt.SelectedUser = orderMgmt.UserOptions.FirstOrDefault(u => u.Key == user?.Id);
                orderMgmt.IsEnabled = false;
                orderMgmtList.Add(orderMgmt);
            }
            TableData = new ObservableCollection<OrderMgmt>(orderMgmtList);
        }

        private async Task OnAdd()
        {
            var newOrder = new OrderMgmt();

            var users = await _userService.GetAllUsersAsync(); // Fetch all users
            foreach (var u in users)
            {
                newOrder.UserOptions.Add(new KeyValuePair<int, string>(u.Id, u.UserName));
            }

            newOrder.Order.TransactionCode = GenerateSecureRandomString(6);

            TableData.Add(newOrder);
        }

        private void OnEdit(OrderMgmt order)
        {
            // Enable editing for the selected user
            if (order != null)
            {
                order.IsEnabled = true;
                order.IsSelected = true;
            }
        }

        private async Task OnSave()
        {
            try
            {
                var selectedOrder = TableData.Where(x => x.IsSelected == true).ToList();

                foreach (var orderMgmt in selectedOrder)
                {
                    var orderModel = new Order()
                    {
                        Id = orderMgmt.Order.Id,
                        Status = orderMgmt.Order.Status,
                        Subtotal = orderMgmt.Order.Subtotal,
                        TransactionCode = orderMgmt.Order.TransactionCode,
                        Date = orderMgmt.Order.Date,
                        UserId = orderMgmt.Order.UserId,
                    };

                    if (orderMgmt.Order.Id == -1)
                    {
                        await _orderService.CreateOrderAsync(new Order()
                        {
                            Status = orderMgmt.Order.Status,
                            Subtotal = orderMgmt.Order.Subtotal,
                            TransactionCode = orderMgmt.Order.TransactionCode,
                            Date = DateTime.Now,
                            UserId = orderMgmt.Order.UserId,
                        });
                    }
                    else
                    {
                        await _orderService.UpdateOrderAsync(new Order()
                        {
                            Id = orderMgmt.Order.Id,
                            Status = orderMgmt.Order.Status,
                            Subtotal = orderMgmt.Order.Subtotal,
                            TransactionCode = orderMgmt.Order.TransactionCode,
                            Date = orderMgmt.Order.Date,
                            UserId = orderMgmt.Order.UserId,
                        });

                        var cartList = await
                            _cartRecordService.GetCartRecordsByConditionAsync(
                                transactionCode: orderMgmt.Order.TransactionCode);
                        foreach (var cartRecord in cartList)
                        {
                            cartRecord.Status = (orderMgmt.Order.Status == "completed" && cartRecord.Status != "paid")
                                ? "paid"
                                : cartRecord.Status;

                            cartRecord.UserId = orderMgmt.Order.UserId;
                            await _cartRecordService.UpdateCartRecordAsync(cartRecord);
                        }
                    }
                }

                await Application.Current.MainPage.DisplayAlert("Info", "Changes saved.", "OK");
                await LoadData();
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Error", ex.Message, "OK");
            }
        }

        private async Task OnRemove()
        {
            var selectedOrder = TableData.Where(x => x.IsSelected).ToList();

            foreach (var orderMgmt in selectedOrder)
            {
                var carts = await _cartRecordService.GetCartRecordsByConditionAsync(transactionCode: orderMgmt.Order.TransactionCode);
                if (carts != null)
                {
                    foreach (var cart in carts)
                    {
                        cart.TransactionCode = "";
                        cart.Status = "pending";
                        await _cartRecordService.UpdateCartRecordAsync(cart);
                    }
                }

                await _orderService.DeleteOrderAsync(orderMgmt.Order.Id);
            }

            await Application.Current.MainPage.DisplayAlert("Info", "Order removed.", "OK");
            await LoadData();
        }

        private async Task OnSearch()
        {
            TableData.Clear();

            var orderMgmtList = new List<OrderMgmt>();

            var orders = await _orderService.GetOrdersByConditionAsync(userName: UserName, transactionCode: TransactionCode,
                dateFrom: DateFrom, dateTo: DateTo);
            if (orders != null)
            {
                foreach (var order in orders)
                {
                    var user = await _userService.GetUserByIdAsync(order.UserId);
                    var cartList =
                        await _cartRecordService.GetCartRecordsByConditionAsync(transactionCode: order.TransactionCode);

                    var cartMgmtList = new List<CartMgmt>();
                    foreach (var cart in cartList)
                    {
                        var product = await _productService.GetProductByIdAsync(cart.ProductId);
                        cartMgmtList.Add(new CartMgmt(product, user, cart));
                    }

                    var orderMgmt = new OrderMgmt(user, order, cartMgmtList);

                    var users = await _userService.GetAllUsersAsync();
                    foreach (var u in users)
                    {
                        orderMgmt.UserOptions.Add(new KeyValuePair<int, string>(u.Id, u.UserName));
                    }

                    orderMgmt.IsEnabled = false;
                    orderMgmt.SelectedUser = orderMgmt.UserOptions.FirstOrDefault(u => u.Key == user?.Id);
                    orderMgmtList.Add(orderMgmt);

                    TableData = new ObservableCollection<OrderMgmt>(orderMgmtList);
                }
            }
        }

        private void OnSelectedAll()
        {
            foreach (var tableData in TableData)
            {
                tableData.IsSelected = !tableData.IsSelected;
            }
        }

        private async void OnShowOrderDetail(List<CartMgmt> carts)
        {
            if (carts == null || !carts.Any())
            {
                Debug.WriteLine("CartRecord is null or empty.");
                await Application.Current.MainPage.DisplayAlert("Info", "CartRecord is empty.", "OK");
                return;
            }

            var cartPopupPage = new CartPopupPage
            {
                BindingContext = new CartPopupViewModel(carts, _cartRecordService, _orderService)
            };

            // Ensure event is not subscribed multiple times
            Rg.Plugins.Popup.Services.PopupNavigation.Instance.Popped -= OnPopupClosed;
            Rg.Plugins.Popup.Services.PopupNavigation.Instance.Popped += OnPopupClosed;

            await Application.Current.MainPage.Navigation.PushPopupAsync(cartPopupPage);
        }

        // Event handler to refresh data after the popup is closed
        private async void OnPopupClosed(object sender, Rg.Plugins.Popup.Events.PopupNavigationEventArgs e)
        {
            // Check if the popup being closed is the one you're interested in
            if (e.Page is CartPopupPage)
            {
                // Unsubscribe to prevent multiple calls
                Rg.Plugins.Popup.Services.PopupNavigation.Instance.Popped -= OnPopupClosed;

                // Refresh the data
                await LoadData();
            }
        }

        private string GenerateSecureRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Range(0, length).Select(_ =>
            {
                var rng = RandomNumberGenerator.Create();
                var bytes = new byte[1];
                rng.GetBytes(bytes);
                return chars[bytes[0] % chars.Length];
            }).ToArray());
        }
    }
}