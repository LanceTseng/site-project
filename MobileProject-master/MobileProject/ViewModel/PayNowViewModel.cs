using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Service.Interface;
using MobileProject.Service;
using MobileProject.View;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class PayNowViewModel : BaseViewModel
    {
        private readonly IOrderService _orderService;
        private readonly ICartRecordService _cartRecordService;

        private string _customerName;
        private string _creditCardName;
        private string _creditCardNumber;
        private string _cvCode;

        public string CustomerName
        {
            get => _customerName;
            set
            {
                if (_customerName != value)
                {
                    _customerName = value;
                    OnPropertyChanged();
                    UpdateCanExecute();
                }
            }
        }

        public string CreditCardName
        {
            get => _creditCardName;
            set
            {
                if (_creditCardName != value)
                {
                    _creditCardName = value;
                    OnPropertyChanged();
                    UpdateCanExecute();
                }
            }
        }

        public string CreditCardNumber
        {
            get => _creditCardNumber;
            set
            {
                if (_creditCardNumber != value)
                {
                    _creditCardNumber = value;
                    OnPropertyChanged();
                    UpdateCanExecute();
                }
            }
        }

        public string CVCode
        {
            get => _cvCode;
            set
            {
                if (_cvCode != value)
                {
                    _cvCode = value;
                    OnPropertyChanged();
                    UpdateCanExecute();
                }
            }
        }

        public ICommand CompletePaymentCommand { get; }

        public PayNowViewModel( IOrderService orderService, ICartRecordService cartRecordService)
        {
            _cartRecordService = cartRecordService;
            _orderService = orderService;

            CompletePaymentCommand = new Command(async () => await CompletePaymentAsync(), CanProcess);

            _ = LoadTask();
        }

        private async Task LoadTask()
        {
            var userName = await SecureStorageHelper.GetUsernameAsync();
            SetProperty(ref _customerName, userName);
        }

        private async Task CompletePaymentAsync()
        {
            try
            {
                var userIdString = await SecureStorageHelper.GetUserIdAsync();
                if (!int.TryParse(userIdString, out int userId))
                {
                    await Application.Current.MainPage.DisplayAlert("Error", "User ID not found.", "OK");
                    return;
                }


                if (!IsValidCreditCard(CreditCardNumber))
                {
                    await Application.Current.MainPage.DisplayAlert("Invalid Input", "Please enter a valid credit card number.", "OK");
                    return;
                }

                if (!IsValidCVCode(CVCode))
                {
                    // Handle invalid CVV input
                    await Application.Current.MainPage.DisplayAlert("Invalid Input", "Please enter a valid CVV code.", "OK");
                    return;
                }

                var transactionCode = GenerateSecureRandomString(6);

                // Update cart records
                var cart = await _cartRecordService.GetCartRecordsByConditionAsync(status: "pending", userId: userId);
                if (!cart.Any())
                {
                    await Application.Current.MainPage.DisplayAlert("Info", "No items in the cart.", "OK");
                    return;
                }

                foreach (var cartRecord in cart)
                {
                    cartRecord.Status = "paid";
                    cartRecord.TransactionCode = transactionCode;
                    await _cartRecordService.UpdateCartRecordAsync(cartRecord);
                }

                // Insert a new order
                await _orderService.CreateOrderAsync(new Order
                {
                    Date = DateTime.Now,
                    Subtotal = cart.Sum(x => x.Total),
                    TransactionCode = transactionCode,
                    Status = "completed",
                    UserId = userId
                });

                await Application.Current.MainPage.DisplayAlert("Info", "Order Completed.", "OK");

                // Navigate to the PayResultPage
                await Application.Current.MainPage.Navigation.PushAsync(new PayResultPage());
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Error", ex.Message, "OK");
            }
        }

        private bool CanProcess()
        {
            // Enable the button only when all required fields are filled
            return !string.IsNullOrWhiteSpace(CustomerName) &&
                   !string.IsNullOrWhiteSpace(CreditCardName) &&
                   !string.IsNullOrWhiteSpace(CreditCardNumber) &&
                   !string.IsNullOrWhiteSpace(CVCode);
        }

        private void UpdateCanExecute()
        {
            if (CompletePaymentCommand is Command command)
            {
                command.ChangeCanExecute();
            }
        }

        private bool IsValidCreditCard(string creditCardNumber)
        {
            if (string.IsNullOrWhiteSpace(creditCardNumber))
                return false;

            // Regex pattern for major credit card formats (Visa, MasterCard, etc.)
            var regex = new System.Text.RegularExpressions.Regex(@"^\d{16}$");
            return regex.IsMatch(creditCardNumber);
        }

        private bool IsValidCVCode(string cvCode)
        {
            if (string.IsNullOrWhiteSpace(cvCode))
                return false;

            // Regex pattern for CVV: 3 digits or 4 digits
            var regex = new System.Text.RegularExpressions.Regex(@"^\d{3,4}$");
            return regex.IsMatch(cvCode);
        }

        private string GenerateSecureRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var result = new StringBuilder(length);
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] randomBytes = new byte[length];
                rng.GetBytes(randomBytes);

                foreach (byte randomByte in randomBytes)
                {
                    result.Append(chars[randomByte % chars.Length]);
                }
            }

            return result.ToString();
        }
    }
}