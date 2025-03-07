using System;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Helpers;
using MobileProject.Service.Interface;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class ProfilePageViewModel : BaseViewModel
    {
        private int _id;
        private string _username;
        private string _newPassword;
        private string _phone;
        private string _email;
        private bool _isBusy;

        private readonly IUserService _userService;

        public int Id
        {
            get => _id;
            set => SetProperty(ref _id, value);
        }

        public string Username
        {
            get => _username;
            set => SetProperty(ref _username, value);
        }

        public string NewPassword
        {
            get => _newPassword;
            set => SetProperty(ref _newPassword, value);
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

        public bool IsBusy
        {
            get => _isBusy;
            set => SetProperty(ref _isBusy, value);
        }

        public ICommand SaveProfileCommand { get; }

        public ProfilePageViewModel(IUserService userService)
        {
            _userService = userService;

            SaveProfileCommand = new Command(async () => await OnSave());

            //Task.Run(async () => await LoadData());
            _ = LoadData();
        }

        private async Task LoadData()
        {
            var userIdString = await SecureStorageHelper.GetUserIdAsync();

            var user = await _userService.GetUserByIdAsync(Convert.ToInt32(userIdString));

            Id = user.Id;
            Username = user.UserName;
            Email = user.Email;
            Phone = user.Phone;
        }

        private async Task OnSave()
        {
            try
            {
                if (await IsExistEmail())
                {
                    await Application.Current.MainPage.DisplayAlert("Error", "Email existed.", "OK");
                    return;
                }

                if (!IsValidEmail())
                {
                    await Application.Current.MainPage.DisplayAlert("Error", "Please enter a valid email address.", "OK");
                    return;
                }

                if (!IsValidPhone())
                {
                    await Application.Current.MainPage.DisplayAlert("Error", "Please enter a valid phone number (e.g., 10 digits).", "OK");
                    return;
                }

                if (!string.IsNullOrEmpty(NewPassword) && !IsValidPassword())
                {
                    NewPassword = string.Empty;
                    await Application.Current.MainPage.DisplayAlert("Error", "Password must be at least 8 characters long and contain at least one uppercase letter.", "OK");
                    return;
                }

                IsBusy = true;
                await Task.Delay(2000); // Simulate loading

                var userIdString = await SecureStorageHelper.GetUserIdAsync();
                if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                {
                    await Application.Current.MainPage.DisplayAlert("Error", "Invalid user ID.", "OK");
                    IsBusy = false;
                    return;
                }

                var currentUser = await _userService.GetUserByIdAsync(userId);
                if (currentUser == null)
                {
                    await Application.Current.MainPage.DisplayAlert("Error", "User not found.", "OK");
                    IsBusy = false;
                    return;
                }

                currentUser.Email = Email;
                currentUser.Phone = Phone;
                currentUser.Password = string.IsNullOrEmpty(NewPassword) ? currentUser.Password : NewPassword;

                await _userService.UpdateUserAsync(currentUser);

                IsBusy = false;

                await Application.Current.MainPage.DisplayAlert("Success", "Account updated successfully", "OK");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error: {ex.Message}");
                await Application.Current.MainPage.DisplayAlert("Error", "An unexpected error occurred.", "OK");
                IsBusy = false;
            }
        }

        private async Task<bool> IsExistEmail()
        {
            var emailExisted = await _userService.GetUsersByConditionAsync(email: Email);
            if (emailExisted!= null)
            {
                foreach (var user in emailExisted)
                {
                    return (user.Id != Id);//if the email belongs to the same current user
                }
            }
      
            return (emailExisted != null);
        }

        private bool IsValidPassword()
        {
            // Regular expression: At least 8 characters, at least one uppercase letter
            var passwordRegex = new System.Text.RegularExpressions.Regex(@"^(?=.*[A-Z]).{8,}$");
            return passwordRegex.IsMatch(NewPassword);
        }

        // Helper method to validate the email using a regular expression
        private bool IsValidEmail()
        {
            // Regular expression for validating email
            var emailRegex = new System.Text.RegularExpressions.Regex(
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                System.Text.RegularExpressions.RegexOptions.IgnoreCase
            );
            return emailRegex.IsMatch(Email.Trim());
        }

        // Helper method to validate the phone number using a regular expression
        private bool IsValidPhone()
        {
            // Regular expression: Digits only, 10-15 digits (modify as needed)
            var phoneRegex = new System.Text.RegularExpressions.Regex(@"^\d{10}$");
            return phoneRegex.IsMatch(Phone);
        }

     
    }
}