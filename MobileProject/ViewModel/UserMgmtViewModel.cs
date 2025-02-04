using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Model;
using MobileProject.Service;
using MobileProject.Service.Interface;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class UserMgmtViewModel : BaseViewModel
    {
        private readonly IUserService _userService;

        private string _userName;
        private string _phone;
        private string _email;
        private string _roleSelected;
        private string _password;
        public string UserName
        {
            get => _userName;
            set => SetProperty(ref _userName, value);
        }

        public string Password
        {
            get => _password;
            set => SetProperty(ref _password, value);
        }

        public string Phone
        {
            get => _phone;
            set => SetProperty(ref _phone, value);
        }

        public string Email
        {
            get => _email;
            set => SetProperty(ref _email, value);
        }

        public string RoleSelected
        {
            get => _roleSelected;
            set => SetProperty(ref _roleSelected, value);
        }

        public ObservableCollection<string> RoleOptions { get; } = new ObservableCollection<string> { "","admin", "user" };
        public ObservableCollection<UserMgmt> TableData { get; private set; } = new ObservableCollection<UserMgmt>();

        public ICommand SaveCommand { get; }
        public ICommand AddCommand { get; }
        public ICommand RemoveCommand { get; }
        public ICommand EditCommand { get; }
        public ICommand QueryCommand { get; }
        public ICommand SelectedAllCommand { get; }

        public UserMgmtViewModel(IUserService userService)
        {
            _userService = userService;

            SaveCommand = new Command(async () => await OnSave());
            AddCommand = new Command(OnAdd);
            RemoveCommand = new Command(async () => await OnRemove());
            EditCommand = new Command<UserMgmt>(OnEdit);
            QueryCommand = new Command(async () => await OnQuery());
            SelectedAllCommand = new Command(OnSelectedAll);

            _ = LoadData();
        }

        private async Task LoadData()
        {
            var users = await _userService.GetAllUsersAsync();

            if (users != null)
            {
                TableData = new ObservableCollection<UserMgmt>(users.Select(u => new UserMgmt(u)));
                OnPropertyChanged(nameof(TableData));
            }
        }

        private async Task OnSave()
        {
            try
            {
                var selectedTableData = TableData.Where(x => x.IsSelected).ToList();

                foreach (var user in selectedTableData)
                {
                    var userModel = new User()
                    {
                        Id = user.User.Id,
                        UserName = user.User.UserName,
                        Password = user.User.Password,
                        Email = user.User.Email,
                        Phone = user.User.Phone,
                        Role = user.User.Role,
                        CreatedDate = user.User.CreatedDate != DateTime.MinValue ? user.User.CreatedDate : DateTime.Now
                    };

                    if (user.User.Id == -1)
                        await _userService.CreateUserAsync(userModel);
                    else
                        await _userService.UpdateUserAsync(userModel);
                }
                await Application.Current.MainPage.DisplayAlert("Info", "Changes saved.", "OK");
                await LoadData();
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Error", ex.Message, "OK");
            }
        }

        private void OnAdd()
        {
            var newUser = new UserMgmt(new User { Id = -1, CreatedDate = DateTime.Now, Role = "user" })
            {
                IsEnabled = true,
                IsSelected = true
            };
            TableData.Add(newUser);
        }

        private void OnEdit(UserMgmt user)
        {
            if (user != null)
            {
                user.IsEnabled = true;
                user.IsSelected = true;
            }
        }

        private async Task OnRemove()
        {
            var selectedUsers = TableData.Where(u => u.IsSelected).ToList();
            foreach (var user in selectedUsers)
            {
                await _userService.DeleteUserAsync(user.User.Id);
            }
            await Application.Current.MainPage.DisplayAlert("Info", "User removed.", "OK");
            await LoadData();
        }

        private async Task OnQuery()
        {
            var users = await _userService.GetUsersByConditionAsync(userName: UserName, phone: Phone, email: Email, role: RoleSelected);
            if (users != null)
            {
                TableData = new ObservableCollection<UserMgmt>(users.Select(u => new UserMgmt(u)));
            }
            else
            {
                TableData.Clear();
               
            }
            OnPropertyChanged(nameof(TableData));
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