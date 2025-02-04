namespace MobileProject.Model
{
    public class Cart : BaseModel
    {
        private CartRecord _cartRecord;
        private Product _product;
        public CartRecord CartRecord
        {
            get => _cartRecord;
            set => SetProperty(ref _cartRecord, value);
        }
        public Product Product
        {
            get => _product;
            set => SetProperty(ref _product, value);
        }

        public Cart(CartRecord cartRecord, Product product)
        {
            CartRecord = cartRecord;
            Product = product;
        }
    }
}