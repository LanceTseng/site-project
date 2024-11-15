using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Barbershop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore.ValueGeneration.Internal;

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
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userRole = await _context.UserRoles
                .Include(u => u.Role)
                .Include(u => u.User)
                .FirstOrDefaultAsync(m => m.UserId == id);
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
            if (ModelState.IsValid)
            {
                if (UserRoleExists(userRole.UserId))
                {
                    var userRoleExist = await _context.UserRoles.FindAsync(userRole.UserId);
                    _context.UserRoles.Remove(userRoleExist);
                    await _context.SaveChangesAsync();
                }

                _context.Add(userRole);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            ViewData["RoleId"] = new SelectList(_context.Roles, "RoleId", "RoleName", userRole.RoleId);
            ViewData["UserId"] = new SelectList(_context.Users, "UserId", "Username", userRole.UserId);
            return View(userRole);
        }

        // GET: UserRoles/Edit/5
        public async Task<IActionResult> Edit(int? uid, int? rid)
        {
            if (uid == null || rid == null)
            {
                return NotFound();
            }

            var userRole = await _context.UserRoles
                .Include(ur => ur.User)
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.UserId == uid && ur.RoleId == rid);

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
                var userRoleExist = await _context.UserRoles.FindAsync(uid, rid);
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

            var userRoleNew = await _context.UserRoles
                  .Include(ur => ur.User)
                  .Include(ur => ur.Role)
                  .FirstOrDefaultAsync(ur => ur.UserId == userRole.UserId && ur.RoleId == userRole.RoleId);

            return View(userRoleNew);
        }

        // GET: UserRoles/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var userRole = await _context.UserRoles
                .Include(u => u.Role)
                .Include(u => u.User)
                .FirstOrDefaultAsync(m => m.UserId == id);
            if (userRole == null)
            {
                return NotFound();
            }

            return View(userRole);
        }

        // POST: UserRoles/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var userRole = await _context.UserRoles.FindAsync(id);
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
    }
}