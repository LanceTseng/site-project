using Microsoft.AspNetCore.Mvc;

namespace Barbershop.Controllers
{
    public class DashboardController : BaseController
    {
        public IActionResult Index()
        {
            SetUserContext();
            return View();
        }
       
    }
}
