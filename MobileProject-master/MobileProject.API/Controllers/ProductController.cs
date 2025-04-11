using Microsoft.AspNetCore.Mvc;

namespace MobileProject.API.Controllers
{
    public class ProductController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
