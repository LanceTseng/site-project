using System.Security.Claims;
using FashionShop.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.Controllers
{
    public class UserController : Controller
    {
        private static User currentUser;

        FashionshopDbContext _db;
        public UserController(FashionshopDbContext fashionshopDbContext)
        {
            _db = fashionshopDbContext;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Register()
        {
            return View();
        }

        // POST: /User/Register
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Register(User model)
        {
            var users = _db.Users.ToList();

            // Check if user already exists
            if (users.Any(u => u.UserName == model.UserName))
            {
                ModelState.AddModelError("", "Username is already taken.");
                return View(model);
            }

            // Add new user
            model.Role = "Customer";

            _db.Users.Add(model);
            _db.SaveChanges();

            TempData["SuccessMessage"] = "Registration successful! You can now log in.";
            return RedirectToAction("Login");

        }

        // GET: /User/Login
        public IActionResult Login()
        {
            return View();
        }

        // POST: /User/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(string userName, string password)
        {
            var user = _db.Users.FirstOrDefault(u => u.UserName == userName && u.Password == password);
            if (user != null)
            {
                // Store the logged-in user in the static variable
                currentUser = user;
                TempData["SuccessMessage"] = $"Hello, {user.UserName}!";
                TempData["UserId"] = user.Id;

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var identity = new ClaimsIdentity(claims, "Login");

                var principal = new ClaimsPrincipal(identity);
                HttpContext.SignInAsync(principal);

                return RedirectToAction("Index", "Product");
            }
            else
            {
                TempData["ErrorMessage"] = $"Invalid username or password.";
                return View();
            }
        }

        // GET: /User/Logout
        public IActionResult Logout()
        {
            // Clear session data
            currentUser = null;
            TempData["SuccessMessage"] = "You have been logged out.";
            return RedirectToAction("Login");
        }
        // A helper method to check if a user is logged in
        public static bool IsLoggedIn() => currentUser != null;

        // A helper method to get the logged-in user's name
        public static string GetCurrentUserName() => currentUser?.UserName ?? string.Empty;

    }
}
