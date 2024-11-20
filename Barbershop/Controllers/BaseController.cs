using System.Security.Claims;
using Barbershop.Models;
using Microsoft.AspNetCore.Mvc;

namespace Barbershop.Controllers
{
    public class BaseController : Controller
    {
        public int UserId {
            get
            {
                return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            }
        }
        public string UserName
        {
            get
            {
                return User.FindFirst(ClaimTypes.Name)?.Value;
            } 
        }

        public string UserRole
        {
            get
            {
                return User.FindFirst(ClaimTypes.Role)?.Value;
            }
        }

        public bool IsAdmin
        {
            get
            {
                return User.FindFirst(ClaimTypes.Role)?.Value == "ADMIN";
            }
        }

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
