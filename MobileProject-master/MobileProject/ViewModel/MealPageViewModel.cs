using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Repository;
using MobileProject.View;
using System.Threading.Tasks;
using System.Windows.Input;
using Xamarin.Forms;
using MobileProject.Service;
using MobileProject.Service.Interface;

namespace MobileProject.ViewModel
{
    public class MealPageViewModel : BaseViewModel
    {
        private readonly IProductService _productService;
        private readonly ICartRecordService _cartRecordService;

        private ObservableCollection<Meal> _mealList;

        public ObservableCollection<Meal> MealList
        {
            get => _mealList;
            set => SetProperty(ref _mealList, value);
        }
        public ICommand AddToCartCommand { get; }
        public ICommand NavigateToCartCommand { get; }

        public MealPageViewModel( IProductService productService, ICartRecordService cartRecordService)
        {
            _productService = productService;
            _cartRecordService = cartRecordService;

            AddToCartCommand = new Command<Meal>(async product => await AddToCartAsync(product));
            NavigateToCartCommand = new Command(async () => await NavigateToCartAsync());

            _ = LoadData();
        }

        private async Task LoadData()
        {
            var products = await _productService.GetAllProductsAsync();
            MealList = new ObservableCollection<Meal>(products.Select(p => new Meal(p)));
        }

        private async Task AddToCartAsync(Meal selectedItem)
        {
            try
            {
                var isLogin = await SecureStorageHelper.GetIsLoggedInAsync();
                if (isLogin != "true")
                {
                    await Application.Current.MainPage.DisplayAlert("Info", "Please login first.", "OK");
                    await Application.Current.MainPage.Navigation.PushAsync(new LoginPage());
                    return;
                }

                var userIdString = await SecureStorageHelper.GetUserIdAsync();
                if (!int.TryParse(userIdString, out int userId))
                {
                    await Application.Current.MainPage.DisplayAlert("Error", "User ID not found.", "OK");
                    return;
                }

                var transactionCode = "";
                var cart = new CartRecord()
                {
                    Qty = selectedItem.Quantity, // Use the Quantity property
                    Total = selectedItem.Quantity * selectedItem.Product.Price,
                    ProductId = selectedItem.Product.Id,
                    UserId = userId,
                    Status = "pending",
                    TransactionCode = transactionCode,
                };

                var itemInCart = await _cartRecordService.GetCartRecordsByConditionAsync(
                    status: cart.Status,
                    userId: cart.UserId,
                    productId: cart.ProductId
                );


                if (itemInCart != null)
                {
                    var cartRecord = itemInCart.FirstOrDefault();
                    cartRecord.Qty += cart.Qty;
                    cartRecord.Total = cartRecord.Qty * selectedItem.Product.Price; // Correct the typo `prodcut` to `product`
                    await _cartRecordService.UpdateCartRecordAsync(cartRecord);
                }
                else
                {
                   await _cartRecordService.CreateCartRecordAsync(cart);
                }

                await Application.Current.MainPage.DisplayAlert("Info", $"[ {selectedItem.Product.Name} ] added.", "OK");
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Error", ex.Message, "OK");
            }
        }

        private async Task NavigateToCartAsync()
        {
            await Application.Current.MainPage.Navigation.PushAsync(new CartPage());
        }
    }
}