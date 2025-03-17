using Microsoft.AspNetCore.Mvc;
using MobileProject.API.Models;

namespace MobileProject.API.Controllers
{
    public class AuthController : Controller
    {
        //login
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult SignUp()
        {
            return View();
        }

        public IActionResult ResetPassword()
        {
            return View();
        }
    }
}
