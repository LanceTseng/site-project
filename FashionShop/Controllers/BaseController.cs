using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace FashionShop.Controllers
{
    public class BaseController : Controller
    {
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
        protected void SetUserContext()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            ViewBag.UserRole = userRole;
            ViewBag.UserName = userName;
        }
    }
}
