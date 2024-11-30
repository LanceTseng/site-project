using FashionShop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace FashionShop.Controllers
{
    public class CartController : Controller
    {
        private readonly FashionshopDbContext _context;

        public CartController(FashionshopDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> AddToCart([FromBody] AddToCart addToCart)
        {
            // Find the product in the database
            var product = _context.Products.FirstOrDefault(p => p.Id == addToCart.ProductId);

            if (product == null)
                return BadRequest("Product not found.");

            // Check if the product is already in the cart for the user
            var cartItem = _context.Carts.FirstOrDefault(c => c.ProductId == addToCart.ProductId && c.Status == "New" && c.UserId == 2);

            if (cartItem != null)
            {
                // Update quantity and subtotal
                cartItem.Qty += addToCart.Qty;
                _context.Carts.Update(cartItem);
            }
            else
            {
                // Add new cart item
                var newCartItem = new Cart
                {
                    ProductId = product.Id,
                    Qty = addToCart.Qty,
                    Status = "New",
                    UserId = 2,
                    Created = DateTime.Now,
                    CartCode = null
                };
                _context.Carts.Add(newCartItem);
            }

            // Save changes to the database
            _context.SaveChanges();

            // Fetch updated cart items for the response
            var updatedCartItems = _context.Carts
                .Where(c => c.Status == "New" && c.UserId == 2)
                .Select(c => new CartViewModel
                {
                    ProductId = c.Product.Id,
                    ProductName = c.Product.ProductName,
                    Qty = c.Qty,
                    SubTotal = Convert.ToDecimal(c.Qty * c.Product.Price)
                })
                .ToList();

            var subTotal = updatedCartItems.Sum(item => item.SubTotal);
            var tax = subTotal * 0.13m;
            var total = subTotal + tax;

            // Return updated cart as JSON
            return Json(new
            {
                cartItems = updatedCartItems,
                subTotal = subTotal,
                tax = tax,
                total = total
            });
        }
    }
}
