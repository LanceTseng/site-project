using Microsoft.AspNetCore.Mvc;

namespace MobileProject.API.Controllers
{
    public class OrderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
