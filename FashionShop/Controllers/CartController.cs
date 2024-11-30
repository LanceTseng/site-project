using FashionShop.Models;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.Controllers
{
    public class CartController : Controller
    {
        //public IActionResult Index()
        //{
        //    return View();
        //}
        private static List<CartViewModel> CartItems = new List<CartViewModel>();

        private static List<ProductViewModel> Products = new List<ProductViewModel>
    {
        new ProductViewModel { Id = 1, ProductName = "Product A", Price = 10.99m, ImageUrl = "/images/product-a.jpg" },
        new ProductViewModel { Id = 2, ProductName = "Product B", Price = 15.49m, ImageUrl = "/images/product-b.jpg" },
        new ProductViewModel { Id = 3, ProductName = "Product C", Price = 7.99m, ImageUrl = "/images/product-c.jpg" }
    };

        public IActionResult Index()
        {
            var model = new OrderViewModel
            {
                Products = Products,
                CartItems = CartItems,
                SubTotal = CartItems.Sum(x => x.SubTotal),
                Tax = CartItems.Sum(x => x.SubTotal) * 0.1m, // Example tax calculation (10%)
                Total = CartItems.Sum(x => x.SubTotal) * 1.1m // Subtotal + Tax
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult AddToCart(int productId, int qty)
        {
            // Find the product
            var product = Products.FirstOrDefault(p => p.Id == productId);

            if (product == null)
                return BadRequest("Product not found.");

            // Check if the product is already in the cart
            var existingCartItem = CartItems.FirstOrDefault(c => c.ProductId == productId);

            if (existingCartItem != null)
            {
                // Update the quantity
                existingCartItem.Qty += qty;
                existingCartItem.SubTotal = Convert.ToDecimal(existingCartItem.Qty * product.Price);
            }
            else
            {
                // Add new item to the cart
                CartItems.Add(new CartViewModel
                {
                    ProductId = product.Id,
                    ProductName = product.ProductName,
                    Qty = qty,
                    SubTotal =Convert.ToDecimal(qty * product.Price) 
                });
            }

            // Recalculate totals
            var subTotal = CartItems.Sum(x => x.SubTotal);
            var tax = subTotal * 0.1m; // Example 10% tax
            var total = subTotal + tax;

            // Return updated cart
            return Json(new
            {
                cartItems = CartItems,
                subTotal,
                tax,
                total
            });
        }

        [HttpGet]
        public IActionResult GetCart()
        {
            // Return the partial view for the cart
            return PartialView("_Cart", CartItems);
        }
    }
}
