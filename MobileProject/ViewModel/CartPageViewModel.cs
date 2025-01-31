using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Repository;
using MobileProject.View;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class CartPageViewModel : BaseViewModel
    {
        private readonly CartRecordRepository _cartRecordRepository;
        private readonly ProductRepository _productRepository;

        public CartPageViewModel()
        {
            _cartRecordRepository = new CartRecordRepository();
            _productRepository = new ProductRepository();

            CartItems = new ObservableCollection<Cart>();

            DeleteItemCommand = new Command<Cart>(async item => await DeleteItem(item));
            EditItemCommand = new Command<Cart>(async item => await EditItem(item));
            LoadCartCommand = new Command(async () => await LoadCart());
            PayNowCommand = new Command(OnPayNow);

           _ = LoadCart();
        }

        public ObservableCollection<Cart> CartItems { get; set; }

        private decimal _itemTotal;
        public decimal ItemTotal
        {
            get => _itemTotal;
            set => SetProperty(ref _itemTotal, value);
        }

        private decimal _subtotal;
        public decimal Subtotal
        {
            get => _subtotal;
            set => SetProperty(ref _subtotal, value);
        }

        public ICommand DeleteItemCommand { get; }
        public ICommand EditItemCommand { get; }
        public ICommand LoadCartCommand { get; }
        public ICommand PayNowCommand { get; }

        private async Task LoadCart()
        {
            var userIdString = await SecureStorageHelper.GetUserIdAsync();
            if (!int.TryParse(userIdString, out int userId))
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Failed to retrieve user ID.", "OK");
                return;
            }

            var cartRecords = _cartRecordRepository.GetFilteredCartRecord("pending", userId);
            CartItems.Clear();

            foreach (var record in cartRecords)
            {
                var products = await _productRepository.GetFilteredProductsAsync(productId: record.ProductId);
                var product = products.FirstOrDefault();

                if (product != null)
                {
                    CartItems.Add(new Cart(record, product));
                }
            }

            ItemTotal = CartItems.Sum(x => x.CartRecord.Qty);
            Subtotal = CartItems.Sum(x => x.CartRecord.Total);
        }

        private async Task DeleteItem(Cart item)
        {
            var products = await _productRepository.GetFilteredProductsAsync(productId: item.CartRecord.ProductId);
            var product = products.FirstOrDefault();

            if (product == null)
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Product not found.", "OK");
                return;
            }

            bool answer = await Application.Current.MainPage.DisplayAlert(
                "Confirmation",
                $"Are you sure you want to delete [ {product.Name} ]?",
                "Yes",
                "Cancel");

            if (answer)
            {
                _cartRecordRepository.DeleteCart(item.CartRecord.Id);
                await LoadCart();
            }
        }

        private async Task EditItem(Cart item)
        {
            var products = await _productRepository.GetFilteredProductsAsync(productId: item.CartRecord.ProductId);
            var product = products.FirstOrDefault();

            if (product == null)
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Product not found.", "OK");
                return;
            }

            string result = await Application.Current.MainPage.DisplayPromptAsync(
                "Edit Quantity",
                $"Update quantity for: {product.Name}",
                initialValue: item.CartRecord.Qty.ToString(),
                maxLength: 4,
                keyboard: Keyboard.Numeric);

            if (!string.IsNullOrWhiteSpace(result) && int.TryParse(result, out int newQuantity) && newQuantity > 0)
            {
                item.CartRecord.Qty = newQuantity;
                item.CartRecord.Total = product.Price * newQuantity;

                _cartRecordRepository.UpdateCart(item.CartRecord);
                await LoadCart();
            }
            else
            {
                await Application.Current.MainPage.DisplayAlert("Error", "Invalid quantity entered.", "OK");
            }
        }

        private void OnPayNow()
        {
            Application.Current.MainPage.Navigation.PushAsync(new PayNow());
        }
    }
}