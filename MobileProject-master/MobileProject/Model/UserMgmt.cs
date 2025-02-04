using System.Collections.ObjectModel;

namespace MobileProject.Model
{
    public class UserMgmt : BaseModel
    {
        
        private bool _isSelected;
        private bool _isEnabled;
        private User _user;
        private string _role;

        public User User
        {
            get => _user;
            set
            {
                _user = value;
                OnPropertyChanged();

                // Sync Role with User.Role
                if (_user != null)
                {
                    Role = _user.Role;
                }
            }
        }

        public string Role
        {
            get => _role;
            set
            {
                if (_role != value)
                {
                    _role = value;
                    OnPropertyChanged();

                    // Update User.Role
                    if (User != null)
                    {
                        User.Role = _role;
                    }
                }
            }
        }

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

        public ObservableCollection<string> RoleOptions { get; } = new ObservableCollection<string>
        {
            "admin",
            "user"
        };


        public UserMgmt(User user)
        {
            this.User = user;
  
            IsEnabled = false;
            IsSelected = false;
        }
    }
}