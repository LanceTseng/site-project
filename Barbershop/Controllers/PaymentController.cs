using Microsoft.AspNetCore.Mvc;

namespace Barbershop.Controllers
{
    public class PaymentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
