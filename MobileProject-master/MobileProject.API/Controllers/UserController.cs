using Microsoft.AspNetCore.Mvc;

namespace MobileProject.API.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
