using System.Collections.Generic;

namespace MobileProject.Model
{
    public class CartMgmt : BaseModel
    {
        private decimal _qty;
        public decimal Qty
        {
            get => _qty;
            set
            {
                if (_qty != value)
                {
                    _qty = value;
                    OnPropertyChanged(nameof(Qty));

                    CartRecord.Qty = _qty;
                    UpdateTotal();
                }
            }
        }

        private decimal _price;
        public decimal Price
        {
            get => _price;
            set
            {
                if (_price != value)
                {
                    _price = value;
                    OnPropertyChanged(nameof(Price));
                    UpdateTotal();
                }
            }
        }

        private decimal _total;
        public decimal Total
        {
            get => _total;
            private set
            {
                if (_total != value)
                {
                    _total = value;
                    OnPropertyChanged(nameof(Total));
                }
            }
        }

        private User _user;

        public User User
        {
            get => _user;
            set
            {
                _user = value;
                OnPropertyChanged();
            }
        }

        private Product _product;
        public Product Product
        {
            get => _product;
            set
            {
                _product = value;
                OnPropertyChanged();
            }
        }

        private CartRecord _cartRecord;
        public CartRecord CartRecord
        {
            get => _cartRecord;
            set
            {
                _cartRecord = value;
                OnPropertyChanged();

                Qty = _cartRecord.Qty;

            }
        }

        public CartMgmt(Product product, User user, CartRecord cart)
        {
            Product = product;
            User = user;
            CartRecord = cart;
        }

        private void UpdateTotal()
        {
            Total = Qty * Product.Price;
            CartRecord.Total = Total;
        }
    }
}