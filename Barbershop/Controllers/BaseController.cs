using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Barbershop.Controllers
{
    public class BaseController : Controller
    {
        protected void SetUserContext()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            ViewBag.UserRole = userRole;
            ViewBag.UserId = userId;
            ViewBag.IsAdmin = userRole == "ADMIN";
            ViewBag.UserName = userName;
        }
    }
}
