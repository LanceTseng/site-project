using FashionShop.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FashionShop.Controllers
{
    public class ProductController : BaseController
    {
        private FashionshopDbContext _dbContext;
        public ProductController(FashionshopDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public IActionResult Index()
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

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


            var cartItems = _dbContext.Carts.Where(x => x.UserId == userId && x.Status == "New").Select(c =>
                new CartViewModel
                {
                    ProductId = c.ProductId,
                    ProductName = c.Product.ProductName,
                    Qty = c.Qty,
                    SubTotal =Convert.ToDecimal(c.Product.Price * c.Qty) 
                }).ToList();
            

            var subTotal = cartItems.Sum(x => x.SubTotal);
            var tax = subTotal * 0.13m; 
            var total = subTotal + tax;

            var viewModel = new OrderViewModel
            {
                Products = products,
                CartItems = cartItems,
                SubTotal = subTotal,
                Tax = tax,
                Total = total
            };

            SetUserContext();

            return View(viewModel);
        }
    }
}
