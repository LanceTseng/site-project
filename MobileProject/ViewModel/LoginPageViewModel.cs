using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Helpers;
using MobileProject.Repository;
using MobileProject.View;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class LoginPageViewModel : BaseViewModel
    {
        private string _username;
        private string _password;
        private bool _isBusy;

        private UserRepository _userRepository;

        public string Username
        {
            get => _username;
            set
            {
                _username = value;
                OnPropertyChanged();
                UpdateCanExecute();
            }
        }

        public string Password
        {
            get => _password;
            set
            {
                _password = value;
                OnPropertyChanged();
                UpdateCanExecute();
            }
        }

        public bool IsBusy
        {
            get => _isBusy;
            set
            {
                _isBusy = value;
                OnPropertyChanged(nameof(IsBusy));
            }
        }

        public ICommand LoginCommand { get; }

         
        public LoginPageViewModel()
        {
            LoginCommand = new Command(async () => await OnLogin(), CanLogin);
        }

        private async Task OnLogin()
        {
            IsBusy = true;

            // Simulate a delay (e.g., network request)
            await Task.Delay(2000);

            IsBusy = false;

            _userRepository = new UserRepository();
            var user = _userRepository.GetFilterUser(Username, Password).FirstOrDefault();

            if (user != null) // Replace with real authentication logic
            {
                await SecureStorageHelper.SetUserSessionAsync("true", user.UserName, user.Role, user.Id.ToString());

                await Application.Current.MainPage.DisplayAlert("Success", "Login successful", "OK");
                // Navigate to the main page
                Application.Current.MainPage = new NavigationPage(new HomePage());
            }
            else
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Invalid username or password", "OK");
            }
        }

        private void UpdateCanExecute()
        {
            if (LoginCommand is Command command)
            {
                command.ChangeCanExecute();
            }
        }

        private bool CanLogin()
        {
            // Enable the button only when username and password are not empty
            return !string.IsNullOrWhiteSpace(Username) && !string.IsNullOrWhiteSpace(Password) && !IsBusy;
        }
    }
}