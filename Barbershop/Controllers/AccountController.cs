using System.Data;
using System.Security.Claims;
using Barbershop.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Barbershop.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Login() => View();

        [HttpPost]
        public IActionResult Login(UserLoginModel model)
        {
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username && u.Password == model.Password);
            if (user == null)
            {
                ModelState.AddModelError("", "Invalid login attempt.");
                return View(model);
            }

            // Retrieve roles for the user from the database (you should have a relationship between Users and Roles)
            var role = _context.UserRoles.Where(ur => ur.UserId == user.UserId).Select(ur => ur.Role.RoleName).FirstOrDefault();


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, role)
            };

            var identity = new ClaimsIdentity(claims, "Login");

            var principal = new ClaimsPrincipal(identity);
            HttpContext.SignInAsync(principal);

            if (role == "ADMIN")
            {
                return RedirectToAction("Index", "Admin");
            }

            return RedirectToAction("Index", "Dashboard");
        }

        [HttpPost]
        public IActionResult Logout()
        {
            HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }

        [HttpGet]
        public IActionResult Register() => View();

        [HttpPost]
        public IActionResult Register(UserRegisterModel model)
        {
            if (!ModelState.IsValid) return View(model);

            var user = new User
            {
                Username = model.Username,
                Password = model.Password,
                Email = model.Email,
                Phone = model.Phone
            };
            _context.Users.Add(user);
            _context.SaveChanges();

            var userId = _context.Users.FirstOrDefault(s => s.Username == model.Username).UserId;
            var roleId = _context.Roles.FirstOrDefault(s => s.RoleName == "CUSTOMER").RoleId;
            _context.UserRoles.Add(new UserRole()
            {
                UserId = userId,
                RoleId = roleId
            });
            _context.SaveChanges();

            return RedirectToAction("Login");
        }

        [Authorize] // This ensures that only authenticated users can access this action
        public IActionResult Index()
        {
            return View();
        }

        // Optional: Custom Unauthorized Handler if you want to explicitly redirect
        public IActionResult UnauthorizedAccess()
        {
            return View("Unauthorized");
        }
    }
}