using System;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using MobileProject.View;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Model;
using MobileProject.Service;
using MobileProject.Service.Interface;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class SignUpPageViewModel : BaseViewModel
    {
        private string _username;
        private string _password;
        private string _retypePassword;
        private string _phone;
        private string _email;
        private bool _isBusy;

        private readonly IUserService _userService;

        public string Username
        {
            get => _username;
            set
            {
                _username = value;
                SetProperty(ref _username, value);
                UpdateCanExecute();
            }
        }

        public string Password
        {
            get => _password;
            set
            {
                _password = value;
                SetProperty(ref _password, value);
                UpdateCanExecute();
            }
        }

        public string RetypePassword
        {
            get => _retypePassword;
            set
            {
                _retypePassword = value;
                SetProperty(ref _retypePassword, value);
                UpdateCanExecute();
            }
        }

        public string Phone
        {
            get => _phone;
            set
            {
                _phone = value;
                SetProperty(ref _phone, value);
                UpdateCanExecute();
            }
        }

        public string Email
        {
            get => _email;
            set
            {
                _email = value;
                SetProperty(ref _email, value);
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
                UpdateCanExecute();
            }
        }

        public ICommand SignUpCommand { get; }

        public SignUpPageViewModel( IUserService userService)
        {
            _userService = userService;

            SignUpCommand = new Command(async () => await OnSignUp(), CanSignUp);
        }

        private async Task OnSignUp()
        {
            if (await IsValidUserName(Username))
            {
                await Application.Current.MainPage.DisplayAlert("Error", "User existed.", "OK");
                return;
            }

            if (Password != RetypePassword)
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Passwords do not match", "OK");
                return;
            }

            if (!IsValidPassword(Password))
            {
                await Application.Current.MainPage.DisplayAlert(
                    "Error",
                    "Password must be at least 8 characters long and contain at least one uppercase letter.",
                    "OK"
                );
                return;
            }

            // Check if email is valid
            if (!IsValidEmail(Email))
            {
                await Application.Current.MainPage.DisplayAlert(
                    "Error",
                    "Please enter a valid email address.",
                    "OK"
                );
                return;
            }

            if (await IsExistedEmail(Email))
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Email existed.", "OK");
                return;
            }


            if (!IsValidPhone(Phone))
            {
                await Application.Current.MainPage.DisplayAlert(
                    "Error",
                    "Please enter a valid phone number (e.g., 10 digits).",
                    "OK"
                );
                return;
            }

            IsBusy = true;

            await Task.Delay(2000);
            
           await _userService.CreateUserAsync(new User()
            {
                UserName = Username,
                Password = Password,
                Email = Email,
                Phone = Phone,
                CreatedDate = DateTime.Now,
                Role = "user"
            });

            IsBusy = false;

            await Application.Current.MainPage.DisplayAlert("Success", "Account created successfully", "OK");
            Application.Current.MainPage = new NavigationPage(new LoginPage());
        }

        private bool CanSignUp()
        {
            return !string.IsNullOrWhiteSpace(Username) &&
                   !string.IsNullOrWhiteSpace(Password) &&
                   !string.IsNullOrWhiteSpace(RetypePassword) &&
                   !string.IsNullOrWhiteSpace(Phone) &&
                   !string.IsNullOrWhiteSpace(Email) &&
                   !IsBusy;
        }

        private void UpdateCanExecute()
        {
            if (SignUpCommand is Command command)
            {
                command.ChangeCanExecute();
            }   
        }

        private async Task<bool> IsValidUserName(string userName)
        {
            var userExisted = await _userService.GetUsersByConditionAsync(userName:userName);

            return (userExisted != null);
        }

        private async Task<bool> IsExistedEmail(string email)
        {
            var userExisted = await _userService.GetUsersByConditionAsync(email: email);

            return (userExisted != null);
        }

        private bool IsValidPassword(string password)
        {
            // Regular expression: At least 8 characters, at least one uppercase letter
            var passwordRegex = new System.Text.RegularExpressions.Regex(@"^(?=.*[A-Z]).{8,}$");
            return passwordRegex.IsMatch(password);
        }

        // Helper method to validate the email using a regular expression
        private bool IsValidEmail(string email)
        {
            // Regular expression for validating email
            var emailRegex = new System.Text.RegularExpressions.Regex(
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase
            );
            return emailRegex.IsMatch(email.Trim());
        }

        // Helper method to validate the phone number using a regular expression
        private bool IsValidPhone(string phone)
        {
            // Regular expression: Digits only, 10-15 digits (modify as needed)
            var phoneRegex = new System.Text.RegularExpressions.Regex(@"^\d{10}$");
            return phoneRegex.IsMatch(phone);
        }
    }
}