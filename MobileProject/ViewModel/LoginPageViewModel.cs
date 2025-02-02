using System;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Service;
using MobileProject.Service.Interface;
using MobileProject.View;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class LoginPageViewModel : BaseViewModel
    {
        private string _username;
        private string _password;
        private bool _isBusy;

        private readonly ApiService _apiService;

        private readonly IUserService _userService;

        public string Username
        {
            get => _username;
            set
            {
                SetProperty(ref _username, value);
                UpdateCanExecute();
            }
        }

        public string Password
        {
            get => _password;
            set
            {
                SetProperty(ref _password, value);
                UpdateCanExecute();
            }
        }

        public bool IsBusy
        {
            get => _isBusy;
            set
            {
                _isBusy = value;
                SetProperty(ref _isBusy, value);
            }
        }

        public ICommand LoginCommand { get; }

        public ICommand NavigateToSignUpCommand { get; }

        public LoginPageViewModel(ApiService apiService, IUserService userService)
        {
            _apiService = apiService;
            _userService = userService;

            LoginCommand = new Command(async () => await OnLogin(), CanLogin);
            NavigateToSignUpCommand = new Command(async () => await NavigateToCartAsync());
        }

        private async Task OnLogin()
        {
            try
            {
                IsBusy = true;
                var users = await _userService.GetUsersByConditionAsync(userName: Username, password: Password);
                var user = users?.FirstOrDefault();

                if (user == null)
                {
                    await DisplayErrorMessage("Invalid username or password");
                    return;
                }

                await SetUserSessionAndNavigate(user);
            }
            catch (Exception ex)
            {
                await DisplayErrorMessage($"An error occurred: {ex.Message}");
            }
            finally
            {
                IsBusy = false;
            }
        }

        private async Task SetUserSessionAndNavigate(User user)
        {
            await SecureStorageHelper.SetUserSessionAsync("true", user.UserName, user.Role, user.Id.ToString());
            await Application.Current.MainPage.DisplayAlert("Success", "Login successful", "OK");
            Application.Current.MainPage = new NavigationPage(new HomePage());
        }

        private async Task DisplayErrorMessage(string message)
        {
            await Application.Current.MainPage.DisplayAlert("Error", message, "OK");
        }

        private async Task NavigateToCartAsync()
        {
            await Application.Current.MainPage.Navigation.PushAsync(new SignUpPage());
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