using Barbershop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Barbershop.Controllers
{
    public class ScheduleController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ScheduleController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Schedule()
        {
            var model = new SchedulingViewModel
            {
                BarberList = GetBarberSelectList(),
                ServiceList = GetServiceSelectList(),
                AvailableTimes = GetAvailableTimes(),
                ConfirmationDetails = null // or retrieve from session/state as needed
            };

            return View(model);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public IActionResult ScheduleAppointment(int barberId, int serviceId, DateTime date, string time)
        {
            var userId = int.Parse(User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value); // Assumes UserId is stored in claims

            if (ModelState.IsValid)
            {
                var appointment = new Schedule
                {
                    CustomerId = userId,
                    BarberId = barberId,
                    ServiceId = serviceId,
                    StartTime = DateTime.Parse($"{date:yyyy-MM-dd} {time}"),
                    EndTime = DateTime.Parse($"{date:yyyy-MM-dd} {time}").AddMinutes(30), // Assumes 30 mins per appointment
                    Status = "Scheduled"
                };

                _context.Schedules.Add(appointment);
                _context.SaveChanges();

                TempData["SuccessMessage"] = "Appointment scheduled successfully!";
                return RedirectToAction("Schedule", new { id = appointment.ScheduleId });
            }

            // Reload data for the form in case of errors
            ViewBag.Barbers = GetBarberSelectList();
            ViewBag.Services = GetServiceSelectList();
            ViewBag.AvailableTimes = GetAvailableTimes();

            return View();
        }

        // Helper methods for dropdown data
        private List<SelectListItem> GetBarberSelectList()
        {
            return _context.Users
                .Where(user => user.UserRoles.Any(role => role.Role.RoleName == "EMPLOYEE"))
                .Select(user => new SelectListItem
                {
                    Value = user.UserId.ToString(),
                    Text = user.Username // Display name of the barber
                })
                .ToList();
        }

        private List<SelectListItem> GetServiceSelectList()
        {
            return _context.Services
                .Select(service => new SelectListItem
                {
                    Value = service.ServiceId.ToString(),
                    Text = $"{service.ServiceName} - ${service.Price}" // Display name of the service
                })
                .ToList();
        }

        private List<string> GetAvailableTimes()
        {
            var startTime = new TimeSpan(9, 0, 0); // 9:00 AM
            var endTime = new TimeSpan(17, 0, 0);  // 5:00 PM
            var interval = TimeSpan.FromMinutes(30); // 30-minute intervals
            var availableTimes = new List<string>();

            for (var time = startTime; time <= endTime; time += interval)
            {
                availableTimes.Add(time.ToString(@"hh\:mm"));
            }

            return availableTimes;
        }
    }
}