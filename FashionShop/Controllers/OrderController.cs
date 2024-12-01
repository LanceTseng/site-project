using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FashionShop.Models;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.Controllers
{
    public class OrderController : Controller
    {
        FashionshopDbContext _db;
        public OrderController(FashionshopDbContext fashionshopDbContext)
        {
            _db = fashionshopDbContext;   
        }
        public IActionResult Index()
        {
            return View("~/Views/Product/PaymentSuccess.cshtml");
        }

        [HttpPost]
        public  IActionResult  PlaceOrder([FromBody] PlaceOrder model)
        {
            var order = new Order
            {
                CardCode = GenerateSecureRandomString(6),
                PlaceOrderDate = DateTime.Now,
                Status="Paid",
                SubTotal = model.SubTotal,
            };

            _db.Orders.Add(order);
            _db.SaveChanges();

            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);


            var cart = _db.Carts.Where(x => x.UserId == userId && x.Status == "New").ToList();
            foreach (var cartItem in cart)
            {
                cartItem.Status = "Completed"; // Update the property
                cartItem.CartCode = order.CardCode;
            }
            _db.SaveChanges();

            return Ok();
        }

        public static string GenerateSecureRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var result = new StringBuilder(length);
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] randomBytes = new byte[length];
                rng.GetBytes(randomBytes);

                foreach (byte randomByte in randomBytes)
                {
                    result.Append(chars[randomByte % chars.Length]);
                }
            }

            return result.ToString();
        }
    }
}
