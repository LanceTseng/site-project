using Microsoft.AspNetCore.Mvc;

namespace Barbershop.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
       
    }
}
