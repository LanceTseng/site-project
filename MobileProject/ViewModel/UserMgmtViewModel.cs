using MobileProject.Model;
using MobileProject.Repository;
using System.Collections.ObjectModel;
using System.Windows.Input;
using System;
using System.Linq;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class UserMgmtViewModel : BaseViewModel
    {
        private UserRepository _repository;

        private string _userName;//condition
        public string UserName
        {
            get => _userName;
            set
            {
                _userName = value;
                OnPropertyChanged();
            }
        }

        private string _phone;//condition
        public string Phone
        {
            get => _phone;
            set
            {
                _phone = value;
                OnPropertyChanged();
            }
        }

        private string _email;//condition
        public string Email
        {
            get => _email;
            set
            {
                _email = value;
                OnPropertyChanged();
            }
        }

        private string _roleSelected;
        public string RoleSelected
        {
            get => _roleSelected;
          
            set
            {
                _roleSelected = value;
                OnPropertyChanged();    
            }
        }

        public ObservableCollection<string> RoleOptions { get; } = new ObservableCollection<string>
        {
            "admin",
            "user"
        };

        private ObservableCollection<UserMgmt> _tableData;
        public ObservableCollection<UserMgmt> TableData
        {
            get => _tableData;
            set
            {
                _tableData = value;
                OnPropertyChanged();
            }
        }

      
        public ICommand SaveCommand { get; }
        public ICommand AddCommand { get; }
        public ICommand RemoveCommand { get; }
        public ICommand EditCommand { get; }
        public ICommand QueryCommand { get; }
        public ICommand SelectedAllCommand { get; }

        public UserMgmtViewModel()
        {
            _repository = new UserRepository();
            SaveCommand = new Command(OnSave);
            AddCommand = new Command(OnAdd);
            RemoveCommand = new Command(OnRemove);
            EditCommand = new Command<UserMgmt>(OnEdit);
            QueryCommand = new Command(OnQuery);
            SelectedAllCommand=new Command(OnSelectedAll);
            LoadData();
        }

        private async void LoadData()
        {
            var users = _repository.GetFilterUser().ToList();
            TableData = new ObservableCollection<UserMgmt>(users.Select(u => new UserMgmt(u)));
        }

        private async void OnSave()
        {
            try
            {
                foreach (var user in TableData)
                {
                    if (user.User.Id == -1)
                    {
                        await _repository.InsertAsync(new User()
                        {
                            UserName = user.User.UserName,
                            Password = user.User.Password,
                            Email = user.User.Email,
                            Phone = user.User.Phone,
                            Role = user.User.Role,
                            CreatedDate = DateTime.Now
                        });
                    }
                    else
                    {
                        await _repository.UpdateAsync(new User()
                        {
                            Id = user.User.Id,
                            UserName = user.User.UserName,
                            Password = user.User.Password,
                            Email = user.User.Email,
                            Phone = user.User.Phone,
                            Role = user.User.Role,
                            CreatedDate = user.User.CreatedDate
                        });
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

        private void OnAdd()
        {
            var newUser = new UserMgmt(new User { Id = -1, CreatedDate = DateTime.Now, Role = "user"});
            newUser.IsEnabled = true;  // Allow editing for new user
            newUser.IsSelected = true;
            TableData.Add(newUser);
        }

        private void OnEdit(UserMgmt user)
        {
            // Enable editing for the selected user
            if (user != null)
            {
                user.IsEnabled = true;
                user.IsSelected = true;
            }
        }

        private async void OnRemove()
        {
            var selectedUser = TableData.Where(item => item.IsSelected).ToList();
            foreach (var user in selectedUser)
            {
                await _repository.DeleteAsync(user.User.Id);
            }

            await Application.Current.MainPage.DisplayAlert("Info", "User removed.", "OK");
            LoadData();
        }

        private void OnQuery()
        {
            var users = _repository
                .GetFilterUserQuery(userName: UserName, role: RoleSelected, email: Email, phone: Phone).ToList();
               
            TableData = new ObservableCollection<UserMgmt>(users.Select(u => new UserMgmt(u)));
        }

        private void OnSelectedAll()
        {
            foreach (var userMgmt in TableData)
            {
                userMgmt.IsSelected = !userMgmt.IsSelected;
            }
        }
    }
}