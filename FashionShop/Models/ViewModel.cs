namespace FashionShop.Models
{
    public class ViewModel
    {
    }
    public class OrderViewModel
    {
        public List<ProductViewModel> Products { get; set; } = new List<ProductViewModel>();
        public List<CartViewModel> CartItems { get; set; } = new List<CartViewModel>();
        public decimal SubTotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
    }

    public class ProductViewModel
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public decimal? Price { get; set; }
        public string ImageUrl { get; set; }
    }

    public class CartViewModel
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int Qty { get; set; }
        public decimal SubTotal { get; set; }
    }

   

}
