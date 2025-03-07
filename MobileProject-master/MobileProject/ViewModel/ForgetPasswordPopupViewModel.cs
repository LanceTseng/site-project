using System.Linq;
using System.Threading.Tasks;
using Rg.Plugins.Popup.Services;
using System.Windows.Input;
using MobileProject.Model;
using MobileProject.Service;
using Xamarin.Forms;
using MobileProject.Service.Interface;

namespace MobileProject.ViewModel
{
    public class ForgetPasswordPopupViewModel : BaseViewModel
    {
        private readonly IUserService _userService;
        private readonly User _user;
        private string _newPassword;

        public string NewPassword
        {
            get => _newPassword;
            set
            {
                SetProperty(ref _newPassword, value);
                UpdateCanExecute();
            }
        }

        public ICommand ProcessResetPasswordCommand { get; }
        public ICommand CancelCommand { get; }

        public ForgetPasswordPopupViewModel(IUserService userService, User user)
        {
            _userService = userService;
            _user = user;
            ProcessResetPasswordCommand = new Command(async () => await OnProcessResetPassword(), CanResetPassword);
            CancelCommand = new Command(async () => OnCancel());
        }

        private async Task OnProcessResetPassword()
        {

            if (!IsValidPassword(NewPassword))
            {
                await Application.Current.MainPage.DisplayAlert(
                    "Error",
                    "Password must be at least 8 characters long and contain at least one uppercase letter.",
                    "OK"
                );
                return;
            }

            var user = _user;
            user.Password = NewPassword;

            await _userService.UpdateUserAsync(user);

            await Application.Current.MainPage.DisplayAlert("Success", "Password reset successfully!", "OK");

            await PopupNavigation.Instance.PopAsync();
        }

        private async Task OnCancel()
        {
            await PopupNavigation.Instance.PopAsync();
        }

        private bool CanResetPassword()
        {
            // Enable the button only when username and password are not empty
            return !string.IsNullOrWhiteSpace(NewPassword);
        }
        private void UpdateCanExecute()
        {

            (ProcessResetPasswordCommand as Command)?.ChangeCanExecute();
        }
        private bool IsValidPassword(string password)
        {
            // Regular expression: At least 8 characters, at least one uppercase letter
            var passwordRegex = new System.Text.RegularExpressions.Regex(@"^(?=.*[A-Z]).{8,}$");
            return passwordRegex.IsMatch(password);
        }
    }
}