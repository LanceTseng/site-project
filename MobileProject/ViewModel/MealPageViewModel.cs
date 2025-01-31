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

namespace MobileProject.ViewModel
{
    public class MealPageViewModel : BaseViewModel
    {
        private readonly ProductRepository _productRepository;
        private readonly CartRecordRepository _cartRecordRepository;

        public ObservableCollection<Meal> MealList { get; set; }
        public ICommand AddToCartCommand { get; }
        public ICommand NavigateToCartCommand { get; }

        public MealPageViewModel()
        {
            _productRepository = new ProductRepository();
            _cartRecordRepository = new CartRecordRepository();

            var products = _productRepository.GetProductList();
            MealList = new ObservableCollection<Meal>(products.Select(p => new Meal(p)));

            AddToCartCommand = new Command<Meal>(async product => await AddToCartAsync(product));
            NavigateToCartCommand = new Command(async () => await NavigateToCartAsync());
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
                var prodcut =  _productRepository.GetFilteredProducts(productId: selectedItem.Product.Id).FirstOrDefault();
                
                var cart = new CartRecord()
                {
                    Qty = selectedItem.Quantity, // Use the Quantity property
                    Total = selectedItem.Quantity * selectedItem.Product.Price,
                    ProductId = selectedItem.Product.Id,
                    UserId = userId,
                    Status = "pending",
                    TransactionCode = transactionCode,
                };

                var itemInCart = _cartRecordRepository.GetFilteredCartRecord(cart.Status, cart.UserId, cart.ProductId).FirstOrDefault();
                if (itemInCart != null)
                {
                    itemInCart.Qty += cart.Qty;
                    itemInCart.Total = itemInCart.Qty * prodcut.Price;
                    _cartRecordRepository.UpdateCart(itemInCart);
                }
                else
                {
                    _cartRecordRepository.InsertCart(cart);
                }

                await Application.Current.MainPage.DisplayAlert("Info", $"[ {prodcut.Name} ] added.", "OK");
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