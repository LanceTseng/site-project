using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using Xamarin.Forms.Xaml.Diagnostics;

namespace MobileProject.Model
{
    public class OrderMgmt : BaseModel
    {
        
        private User _user;
        public User User
        {
            get => _user;
            set
            {
                _user = value;
                OnPropertyChanged();

            }
        }

        private Order _order;
        public Order Order
        {
            get => _order;
            set
            {
                _order = value;
                OnPropertyChanged();

                if (_order != null)
                {
                    Status = _order.Status;
                }
            }
        }

        private List<CartMgmt> _cartMgmt;
        public List<CartMgmt> CartMgmts
        {
            get => _cartMgmt;
            set
            {
                _cartMgmt = value;
                OnPropertyChanged();
            }
        }

        public ObservableCollection<string> StatusOptions { get; } = new ObservableCollection<string>
        {
            "new",
            "completed"
        };
        private string _status;
        public string Status
        {
            get => _status;
            set
            {
                if (_status != value)
                {
                    _status = value;
                    OnPropertyChanged();

                    // Update User.Role
                    if (Order != null)
                    {
                        Order.Status = _status;
                    }
                }
            }
        }

        

        public ObservableCollection<KeyValuePair<int, string>> UserOptions { get; }
            = new ObservableCollection<KeyValuePair<int, string>>();

        private KeyValuePair<int, string> _selectedUser;
        public KeyValuePair<int, string> SelectedUser
        {
            get => _selectedUser;
            set
            {
                _selectedUser = value;
                OnPropertyChanged();
                // Update the SelectedUserId whenever a new user is selected
                Order.UserId  = _selectedUser.Key;
            }
        }

        private bool _isSelected;
        public bool IsSelected
        {
            get => _isSelected;
            set
            {
                if (_isSelected != value)
                {
                    _isSelected = value;
                    OnPropertyChanged();
                }
            }
        }

        private bool _isEnabled;
        public bool IsEnabled
        {
            get => _isEnabled;
            set
            {
                if (_isEnabled != value)
                {
                    _isEnabled = value;
                    OnPropertyChanged();
                }
            }
        }

        public OrderMgmt()
        {
            User = new User();
            Order = new Order()
            {
                Id = -1,
                Subtotal = 0,
                Status = "new",
                Date = DateTime.Now
            };
            IsEnabled = true;
            IsSelected = true;
        }
        public OrderMgmt(User user, Order order, List<CartMgmt> carts)
        {
            User = user;
            Order = order;
            CartMgmts = carts;
            IsSelected = false;
            IsEnabled = false;
        }

    }
}