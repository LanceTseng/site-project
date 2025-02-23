using Microsoft.AspNetCore.Mvc;

namespace MobileProject.API.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
