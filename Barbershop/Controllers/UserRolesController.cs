using Barbershop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Barbershop.Controllers
{
    public class UserRolesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public UserRolesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: UserRoles
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.UserRoles.Include(u => u.Role).Include(u => u.User);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: UserRoles/Details/5
        public async Task<IActionResult> Details(int? uid, int? rid)
        {
            if (uid == null)
            {
                return NotFound();
            }

            var userRole = await GetUserRoleAsync(uid, rid);
            if (userRole == null)
            {
                return NotFound();
            }

            return View(userRole);
        }

        // GET: UserRoles/Create
        public IActionResult Create()
        {
            ViewData["RoleId"] = new SelectList(_context.Roles, "RoleId", "RoleName");
            ViewData["UserId"] = new SelectList(_context.Users, "UserId", "Username");
            return View();
        }

        // POST: UserRoles/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("UserId,RoleId")] UserRole userRole)
        {
            if (UserRoleExists(userRole.UserId))
            {
                TempData["StatusCode"] = 400;
                TempData["Message"] = "User existed.";
                return View(); ; ;
            }

            _context.Add(userRole);
            await _context.SaveChangesAsync();

            ViewData["RoleId"] = new SelectList(_context.Roles, "RoleId", "RoleName", userRole.RoleId);
            ViewData["UserId"] = new SelectList(_context.Users, "UserId", "Username", userRole.UserId);
            var newUserRole = await GetUserRoleAsync(userRole.UserId, userRole.RoleId);

            TempData["StatusCode"] = 200;
            TempData["Message"] = "Role Create Success.";
            return View(newUserRole);
        }

        // GET: UserRoles/Edit/5
        public async Task<IActionResult> Edit(int? uid, int? rid)
        {
            if (uid == null || rid == null)
            {
                return NotFound();
            }

            var userRole = await GetUserRoleAsync(uid, rid);
            if (userRole == null)
            {
                return NotFound();
            }

            // Pass current role for display and all roles for selection
            ViewBag.RoleIdList = new SelectList(_context.Roles, "RoleId", "RoleName");
            return View(userRole);
        }

        // POST: UserRoles/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int uid, int rid, [Bind("UserId,RoleId")] UserRole userRole)
        {
            if (uid != userRole.UserId)
            {
                return NotFound();
            }
            try
            {
                var userRoleExist = await GetUserRoleAsync(uid, rid);
                _context.UserRoles.Remove(userRoleExist);
                await _context.SaveChangesAsync();

                _context.Add(userRole);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserRoleExists(userRole.UserId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            ViewData["RoleId"] = new SelectList(_context.Roles, "RoleId", "RoleName", userRole.RoleId);
            ViewData["UserId"] = new SelectList(_context.Users, "UserId", "Username", userRole.UserId);
            TempData["StatusCode"] = 200;
            TempData["Message"] = "Role Update Success.";

            var userRoleNew = await GetUserRoleAsync(userRole.UserId, userRole.RoleId);

            return View(userRoleNew);
        }

        // GET: UserRoles/Delete/5
        public async Task<IActionResult> Delete(int? uid, int? rid)
        {
            if (uid == null)
            {
                return NotFound();
            }

            var userRole = await GetUserRoleAsync(uid, rid);
            if (userRole == null)
            {
                return NotFound();
            }

            return View(userRole);
        }

        // POST: UserRoles/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int uid, int rid)
        {
            var userRole = await GetUserRoleAsync(uid, rid);
            if (userRole != null)
            {
                _context.UserRoles.Remove(userRole);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool UserRoleExists(int id)
        {
            return _context.UserRoles.Any(e => e.UserId == id);
        }

        public async Task<UserRole> GetUserRoleAsync(int? userId, int? roleId)
        {
            return await _context.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
        }
    }
}