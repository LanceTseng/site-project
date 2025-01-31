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
using MobileProject.Repository;
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

        private UserRepository _userRepository;

        public string Username
        {
            get => _username;
            set
            {
                _username = value;
                OnPropertyChanged(nameof(Username));
                UpdateCanExecute();
            }
        }

        public string Password
        {
            get => _password;
            set
            {
                _password = value;
                OnPropertyChanged(nameof(Password));
                UpdateCanExecute();
            }
        }

        public string RetypePassword
        {
            get => _retypePassword;
            set
            {
                _retypePassword = value;
                OnPropertyChanged(nameof(RetypePassword));
                UpdateCanExecute();
            }
        }

        public string Phone
        {
            get => _phone;
            set
            {
                _phone = value;
                OnPropertyChanged(nameof(Phone));
                UpdateCanExecute();
            }
        }

        public string Email
        {
            get => _email;
            set
            {
                _email = value;
                OnPropertyChanged(nameof(Email));
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
                UpdateCanExecute();
            }
        }

        public ICommand SignUpCommand { get; }

        public SignUpPageViewModel()
        {
            SignUpCommand = new Command(OnSignUp, CanSignUp);
        }

        private async void OnSignUp()
        {
            if (IsValidUserName(Username))
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

            // Simulate signup delay (e.g., saving to a database)
            await Task.Delay(2000);
            _userRepository = new UserRepository();
            _userRepository.InsertUser(new User()
            {
                UserName = Username,
                Password = Password,
                Email = Email,
                Phone = Phone,
                CreatedDate = DateTime.Now,
                Role = "user"
            });

            IsBusy = false;

            // Perform your signup logic here
            // Example: Save data to SQLite or call an API
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


        private bool IsValidUserName(string userName)
        {
            _userRepository = new UserRepository();
            var userExisted = _userRepository.GetFilterUser(userName, null);

            return userExisted.Any();
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