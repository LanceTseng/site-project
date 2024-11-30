using FashionShop.Models;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.Controllers
{
    public class ProductController : Controller
    {
        private FashionshopDbContext _dbContext;
        public ProductController(FashionshopDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public IActionResult Index()
        {
            // Sample data, replace with real database fetch
            var products = _dbContext.Products
                .Select(p => new ProductViewModel
                {
                    Id = p.Id,
                    ProductName = p.ProductName,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl
                })
                .ToList();


            var cartItems = _dbContext.Carts.Where(x => x.UserId == 123 && x.Status == "New").Select(c =>
                new CartViewModel
                {
                    ProductId = c.ProductId,
                    ProductName = c.Product.ProductName,
                    Qty = c.Qty,
                    SubTotal =Convert.ToDecimal(c.Product.Price * c.Qty) 
                }).ToList();
            

            var subTotal = cartItems.Sum(x => x.SubTotal);
            var tax = subTotal * 1.13m; // Example 10% tax
            var total = subTotal + tax;

            var viewModel = new OrderViewModel
            {
                Products = products,
                CartItems = cartItems,
                SubTotal = subTotal,
                Tax = tax,
                Total = total
            };

            return View(viewModel);
        }
    }
}
