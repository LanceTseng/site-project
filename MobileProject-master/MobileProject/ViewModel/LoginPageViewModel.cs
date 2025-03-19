using System;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Service;
using MobileProject.Service.Interface;
using MobileProject.View;
using MobileProject.View.AdminView;
using Rg.Plugins.Popup.Extensions;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class LoginPageViewModel : BaseViewModel
    {
        private string _username;
        private string _password;
        private string _email;
        private bool _isBusy;

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

        public string Email
        {
            get => _email;
            set
            {
                SetProperty(ref _email, value);
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
        public ICommand ForgotPasswordCommand { get; }
        public ICommand NavigateToSignUpCommand { get; }

        public LoginPageViewModel(IUserService userService)
        {
            _userService = userService;

            LoginCommand = new Command(async () => await OnLogin(), CanLogin);
            NavigateToSignUpCommand = new Command(async () => await NavigateToCartAsync());
            ForgotPasswordCommand = new Command(async () => await ForgotPasswordAsync(), CanResetPassword);
        }

        private async Task ForgotPasswordAsync()
        {
            var users = await _userService.GetUsersByConditionAsync(email: Email);
            if (users == null)
            {
                await DisplayErrorMessage("User not existed");
                return;
            }

            var user = users.FirstOrDefault();

            var forgetPasswordPopup = new ForgetPasswordPopupPage()
            {
                BindingContext = new ForgetPasswordPopupViewModel(_userService, user)
            };

            // Ensure event is not subscribed multiple times
            Rg.Plugins.Popup.Services.PopupNavigation.Instance.Popped -= OnPopupClosed;
            Rg.Plugins.Popup.Services.PopupNavigation.Instance.Popped += OnPopupClosed;

            await Application.Current.MainPage.Navigation.PushPopupAsync(forgetPasswordPopup);
        }

        private async Task OnLogin()
        {
            try
            {
                IsBusy = true;
                var users = await _userService.GetUsersByConditionAsync(email: Email, password: Password);
                var user = users.FirstOrDefault(x=>x.Email == Email && x.Password == Password);
                if (user == null)
                {
                    await DisplayErrorMessage("Invalid email or password");
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
            (LoginCommand as Command)?.ChangeCanExecute();
            (ForgotPasswordCommand as Command)?.ChangeCanExecute();
        }

        private bool CanLogin()
        {
            // Enable the button only when username and password are not empty
            return !string.IsNullOrWhiteSpace(Email) && !string.IsNullOrWhiteSpace(Password) && !IsBusy;
        }

        private bool CanResetPassword()
        {
            // Enable the button only when username and password are not empty
            return !string.IsNullOrWhiteSpace(Email) && !IsBusy;
        }

        private async void OnPopupClosed(object sender, Rg.Plugins.Popup.Events.PopupNavigationEventArgs e)
        {
            // Check if the popup being closed is the one you're interested in
            if (e.Page is CartPopupPage)
            {
                // Unsubscribe to prevent multiple calls
                Rg.Plugins.Popup.Services.PopupNavigation.Instance.Popped -= OnPopupClosed;

            }
        }
    }
}