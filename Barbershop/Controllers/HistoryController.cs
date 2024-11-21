using Barbershop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace Barbershop.Controllers
{
    public class HistoryController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public HistoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var model = new AppointmentFilterViewModel()
            {
                Barbers = GetBarberList(),
                Customers = GetCustomerList(),
                HistoryList = GetHistoryListByRole()
            };

            SetUserContext();

            return View(model);
        }

        private List<SelectListItem> GetBarberList()
        {
            return _context.AppointmentView
                .Where(a => !string.IsNullOrEmpty(a.BarberUsername)) // Exclude null or empty usernames
                .GroupBy(a => new { a.BarberUserId, a.BarberUsername }) // Group by Barber ID and Username to ensure uniqueness
                .Select(group => new SelectListItem
                {
                    Value = group.Key.BarberUserId.ToString(),
                    Text = group.Key.BarberUsername
                })
                .OrderBy(x => x.Text) // Sort alphabetically by BarberUsername
                .ToList();
        }
        private List<SelectListItem> GetCustomerList()
        {
            return _context.AppointmentView
                .Where(a => !string.IsNullOrEmpty(a.CustomerUsername)) // Exclude null or empty usernames
                .GroupBy(a => new { a.CustomerUserId, a.CustomerUsername }) // Group by Barber ID and Username to ensure uniqueness
                .Select(group => new SelectListItem
                {
                    Value = group.Key.CustomerUserId.ToString(),
                    Text = group.Key.CustomerUsername
                })
                .OrderBy(x => x.Text) // Sort alphabetically by BarberUsername
                .ToList();
        }

        private List<AppointmentView> GetHistoryList(int? barberId = null, int? customerId = null, string status = null)
        {
            return _context.AppointmentView
                .Where(x=>(barberId == null || x.BarberUserId == barberId) &&
                                        (customerId == null || x.CustomerUserId == customerId) && 
                                        (status == null || x.Status == status))
                .ToList();
        }

        private List<AppointmentView> GetHistoryListByRole()
        {
            switch (UserRole)
            {
                case "CUSTOMER":
                    return GetHistoryList(null, UserId);
          
                case "EMPLOYEE":
                    return  GetHistoryList(UserId);
                default:
                    return GetHistoryList();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetFilteredHistory([FromBody] AppointmentView filter)
        {
            try
            {
                //Console.WriteLine(_context.AppointmentView.ToQueryString());
                // Fetch all data from the AppointmentView
                var overview = await _context.AppointmentView.ToListAsync();

                // Return a JSON success response with the data
                return Json(new { success = true, data = overview });
            }
            catch (Exception ex)
            {
                // Handle exceptions and return an error response
                return Json(new { success = false, message = "An error occurred while fetching schedules.", error = ex.Message });
            }
        }
    }
}
