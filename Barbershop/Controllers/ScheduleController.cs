using System.Security.Claims;
using Barbershop.Models;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Roles = "ADMIN")]
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
        public IActionResult ScheduleAppointment(SchedulingViewModel model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var appointment = new Schedule
            {
                CustomerId = userId,
                BarberId = model.BarberId,
                ServiceId = model.ServiceId,
                StartTime = DateTime.Parse($"{model.AppointmentDate:yyyy-MM-dd} {model.StartTime}"),
                EndTime = DateTime.Parse($"{model.AppointmentDate:yyyy-MM-dd} {model.EndTime}"),
                Status = "New"
            };

            _context.Schedules.Add(appointment);
            _context.SaveChanges();

            // Update the confirmation details in the model
            model.ConfirmationDetails = new ScheduleConfirmation()
            {
                CustomerName = User.Identity.Name,
                BarberName = _context.Users.Find(model.BarberId)?.Username,
                ServiceName = _context.Services.Find(model.ServiceId)?.ServiceName,
                ServicePrice = _context.Services.Find(model.ServiceId).Price,
                AppointmentDate = model.AppointmentDate,
                StartTime = model.StartTime,
                EndTime = model.EndTime
            };

            // Return the partial view for AJAX
            return PartialView("_ConfirmationDetails", model.ConfirmationDetails);
        }

        // Helper methods for dropdown data
        private List<SelectListItem> GetBarberSelectList()
        {
            return _context.Users
                .Where(user => user.UserRoles.Any(role => role.Role.RoleName == "EMPLOYEE"))
                .Select(user => new SelectListItem
                {
                    Value = user.UserId.ToString(),
                    Text = user.Username
                })
                .ToList();
        }

        private List<SelectListItem> GetServiceSelectList()
        {
            return _context.Services
                .Select(service => new SelectListItem
                {
                    Value = service.ServiceId.ToString(),
                    Text = $"{service.ServiceName} - ${service.Price}"
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