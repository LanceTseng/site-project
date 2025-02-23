using Microsoft.AspNetCore.Mvc;

namespace MobileProject.API.Controllers
{
    public class MenuController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
