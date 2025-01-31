namespace MobileProject.Model
{
    public class Meal
    {
        public Product Product { get; set; }
        public decimal Quantity { get; set; }

        public Meal(Product product)
        {
            Product = product;
            Quantity = 1; // Default quantity
        }
    }
}