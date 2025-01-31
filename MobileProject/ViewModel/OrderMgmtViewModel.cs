using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Windows.Input;
using MobileProject.Model;
using MobileProject.Repository;
using MobileProject.View.AdminView;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class OrderMgmtViewModel : BaseViewModel
    {
        private OrderRepository _orderRepository;
        private UserRepository _userRepository;
        private CartRecordRepository _cartRecordRepository;
        private ProductRepository _productRepository;

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

        public OrderMgmtViewModel()
        {
            _orderRepository = new OrderRepository();
            _cartRecordRepository = new CartRecordRepository();
            _userRepository = new UserRepository();
            _productRepository = new ProductRepository();

            AddCommand = new Command(OnAdd);
            EditCommand = new Command<OrderMgmt>(OnEdit);
            SaveCommand = new Command(OnSave);
            RemoveCommand = new Command(OnRemove);
            SelectedAllCommand = new Command(OnSelectedAll);
            SearchCommand = new Command(OnSearch);

            ShowDetailCommand = new Command<List<CartMgmt>>(OnShowOrderDetail);

            TableData = new ObservableCollection<OrderMgmt>();
            LoadData();
        }

        private void LoadData()
        {
            var orderMgmtList = new List<OrderMgmt>();

            var users = _userRepository.GetFilterUserQuery().ToList(); // Fetch all users
            var orders = _orderRepository.GetFilteredOrders().ToList();

            foreach (var order in orders)
            {
                var user = _userRepository.GetFilterUserQuery(userId: order.UserId).FirstOrDefault();
                var cartList = _cartRecordRepository
                    .GetFilteredCartRecord(transactionCode: order.TransactionCode)
                    .ToList();
                var cartMgmtList = new List<CartMgmt>();
                foreach (var cart in cartList)
                {
                    var product = _productRepository.GetFilteredProducts(productId: cart.ProductId).FirstOrDefault();
                    cartMgmtList.Add(new CartMgmt(product, user, cart));
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

        private void OnAdd()
        {
            var newOrder = new OrderMgmt();

            var users = _userRepository.GetFilterUserQuery().ToList(); // Fetch all users
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

        private async void OnSave()
        {
            try
            {
                var selectedOrder = TableData.Where(x => x.IsSelected == true).ToList();

                foreach (var orderMgmt in selectedOrder)
                {
                    if (orderMgmt.Order.Id == -1)
                    {
                        await _orderRepository.InsertAsync(new Order()
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
                        await _orderRepository.UpdateAsync(new Order()
                        {
                            Id = orderMgmt.Order.Id,
                            Status = orderMgmt.Order.Status,
                            Subtotal = orderMgmt.Order.Subtotal,
                            TransactionCode = orderMgmt.Order.TransactionCode,
                            Date = orderMgmt.Order.Date,
                            UserId = orderMgmt.Order.UserId,
                        });

                        var cartlist =
                            _cartRecordRepository.GetFilteredCartRecord(
                                transactionCode: orderMgmt.Order.TransactionCode).ToList();
                        foreach (var cartRecord in cartlist)
                        {
                            cartRecord.Status = (orderMgmt.Order.Status == "completed" && cartRecord.Status != "paid")
                                ? "paid"
                                : cartRecord.Status;

                            cartRecord.UserId = orderMgmt.Order.UserId;
                            await _cartRecordRepository.UpdateAsync(cartRecord);
                        }
                    }
                }

                await Application.Current.MainPage.DisplayAlert("Info", "Changes saved.", "OK");
                LoadData();
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Error", ex.Message, "OK");
            }
        }

        private async void OnRemove()
        {
            var selectedOrder = TableData.Where(x => x.IsSelected == true).ToList();

            foreach (var orderMgmt in selectedOrder)
            {
                var carts = _cartRecordRepository.GetFilteredCartRecord(
                    transactionCode: orderMgmt.Order.TransactionCode).ToList();
                foreach (var cart in carts)
                {
                    cart.TransactionCode = "";
                    cart.Status = "pending";
                    await _cartRecordRepository.UpdateAsync(cart);
                }

                await _orderRepository.DeleteAsync(orderMgmt.Order.Id);
            }

            await Application.Current.MainPage.DisplayAlert("Info", "Order removed.", "OK");
            LoadData();
        }

        private async void OnSearch()
        {
            var orderMgmtList = new List<OrderMgmt>();

            var users = _userRepository.GetFilterUserQuery(userName:UserName).ToList(); // Fetch all users
            var orders = _orderRepository.GetFilteredOrder(users: users, transactionCode: TransactionCode,
                dateFrom: DateFrom, dateTo: DateTo).ToList();

            foreach (var order in orders)
            {
                var user = _userRepository.GetFilterUserQuery(userId: order.UserId).FirstOrDefault();
                var cartList = _cartRecordRepository
                    .GetFilteredCartRecord(transactionCode: order.TransactionCode)
                    .ToList();
                var cartMgmtList = new List<CartMgmt>();
                foreach (var cart in cartList)
                {
                    var product = _productRepository.GetFilteredProducts(productId: cart.ProductId).FirstOrDefault();
                    cartMgmtList.Add(new CartMgmt(product, user, cart));
                }

                var orderMgmt = new OrderMgmt(user, order, cartMgmtList);
                foreach (var u in users)
                {
                    orderMgmt.UserOptions.Add(new KeyValuePair<int, string>(u.Id, u.UserName));
                }

                orderMgmt.IsEnabled = false;
                orderMgmt.SelectedUser = orderMgmt.UserOptions.FirstOrDefault(u => u.Key == user?.Id);
                orderMgmtList.Add(orderMgmt);
            }

            TableData = new ObservableCollection<OrderMgmt>(orderMgmtList);
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
            var cartPopupPage = new CartPopupPage();

            if (carts.Any())
            {
                cartPopupPage.BindingContext = new CartPopupViewModel(carts);

                // Subscribe to the popup close event
                Rg.Plugins.Popup.Services.PopupNavigation.Instance.Popped += OnPopupClosed;

                await Application.Current.MainPage.Navigation.PushPopupAsync(cartPopupPage);
            }
            else
            {
                Debug.WriteLine("CartRecord is null.");
            }
        }

        // Event handler to refresh data after the popup is closed
        private void OnPopupClosed(object sender, Rg.Plugins.Popup.Events.PopupNavigationEventArgs e)
        {
            // Check if the popup being closed is the one you're interested in
            if (e.Page is CartPopupPage)
            {
                // Unsubscribe to prevent multiple calls
                Rg.Plugins.Popup.Services.PopupNavigation.Instance.Popped -= OnPopupClosed;

                // Refresh the data
                LoadData();
            }
        }

        private string GenerateSecureRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var result = new StringBuilder(length);
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] randomBytes = new byte[length];
                rng.GetBytes(randomBytes);

                foreach (byte randomByte in randomBytes)
                {
                    result.Append(chars[randomByte % chars.Length]);
                }
            }

            return result.ToString();
        }
    }
}