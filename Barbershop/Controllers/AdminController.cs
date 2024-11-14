using Barbershop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barbershop.Controllers
{
    [Authorize(Roles = "ADMIN")]
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Roles()
        {
            var roles = _context.Roles.ToList();
            return View(roles);
        }

        public IActionResult CreateRole()
        {
            var roles = _context.Roles.ToList();
            return View(roles);
        }

        public IActionResult AssignRole()
        {
            var userRoles = _context.UserRoles
                .Include(ur => ur.User) // Eager load the related User
                .Include(ur => ur.Role)
                .ToList(); // Eager load the related Role.ToList();

            return View(userRoles);
        }

        // Create a new role
        [HttpPost]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            if (!string.IsNullOrEmpty(roleName))
            {
                var role = new Role { RoleName = roleName };
                _context.Roles.Add(role);
                await _context.SaveChangesAsync();
                return RedirectToAction("Roles");
            }
            return View("CreateRole", _context.Roles.ToList());
        }

        // Assign a role to a user
        [HttpPost]
        public async Task<IActionResult> AssignRole(int userId, int roleId)
        {
            var user = await _context.Users.FindAsync(userId);
            var role = await _context.Roles.FindAsync(roleId);

            var userRoles = _context.UserRoles
                .Include(ur => ur.User) // Eager load the related User
                .Include(ur => ur.Role)
                .ToList(); // Eager load the related Role.ToList();

            if (user == null || role == null)
            {
                TempData["StatusCode"] = 400;
                TempData["Message"] = "User or Role not found.";
                return View("AssignRole", userRoles);
            }

            var CurrentUserRole =
                await _context.UserRoles.FirstOrDefaultAsync(ur => ur.UserId == userId);

            if (CurrentUserRole == null)
            {
                var userRole = new UserRole { UserId = userId, RoleId = roleId };
                _context.UserRoles.Add(userRole);
                await _context.SaveChangesAsync();

                TempData["StatusCode"] = 201;
                TempData["Message"] = "Assign role successfully.";
            }
            else
            {
                _context.UserRoles.Remove(CurrentUserRole);
                await _context.SaveChangesAsync();

                var userRole = new UserRole { UserId = userId, RoleId = roleId };
                _context.UserRoles.Add(userRole);
                await _context.SaveChangesAsync();

                TempData["StatusCode"] = 200;
                TempData["Message"] = "Role update successfully.";
            }

            userRoles = _context.UserRoles
               .Include(ur => ur.User) // Eager load the related User
               .Include(ur => ur.Role)
               .ToList(); // Eager load the related Role.ToList();
            return View("AssignRole", userRoles);
        }
    }
}