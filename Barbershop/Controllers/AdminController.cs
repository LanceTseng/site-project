using Barbershop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barbershop.Controllers
{
    //[Authorize(Roles = "Admin")]
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

            if (user != null && role != null)
            {
                var userRole = new UserRole { UserId = userId, RoleId = roleId };
                _context.UserRoles.Add(userRole);
                await _context.SaveChangesAsync();
                return RedirectToAction("AssignRole");
            }

            return View("AssignRole", _context.UserRoles.ToList());
        }
    }
}