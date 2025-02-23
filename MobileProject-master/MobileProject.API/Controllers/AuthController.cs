using Microsoft.AspNetCore.Mvc;

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
    }
}
