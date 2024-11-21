using System.Security.Claims;
using Barbershop.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Core.Types;

namespace Barbershop.Controllers
{
    public class AppointmentController : BaseController
    {
        private readonly ApplicationDbContext _context;

        public AppointmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "CUSTOMER,ADMIN")]
        [HttpGet]
        public IActionResult Index()
        {
            var model = new SchedulingViewModel
            {
                BarberList = GetBarberSelectList(),
                ServiceList = GetServiceSelectList(),
                AvailableTimes = GetAvailableTimes(),
                ConfirmationDetails = null // or retrieve from session/state as needed
            };

            SetUserContext();

            return View("Appointment", model);
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
            var endTime = new TimeSpan(21, 0, 0); // 5:00 PM
            var interval = TimeSpan.FromMinutes(30); // 30-minute intervals
            var availableTimes = new List<string>();

            for (var time = startTime; time <= endTime; time += interval)
            {
                availableTimes.Add(time.ToString(@"hh\:mm"));
            }

            return availableTimes;
        }

        [Authorize(Roles = "EMPLOYEE,ADMIN")]
        [HttpGet]
        public IActionResult Approval()
        {
            SetUserContext();

            var model = new ApprovalViewModel()
            {
                Barbers = GetBarberSelectList(),
                Schedules = GetScheduleByCondition("New", UserId)
            };

            return View("Approval", model);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateAppointmentStatus([FromBody] ActionSchedule actionSchedule)
        {
            if (actionSchedule == null || string.IsNullOrEmpty(actionSchedule.Status))
            {
                return BadRequest(new { error = "Invalid input data." });
            }

            var schedule = await GetScheduleByIdAsync(actionSchedule.ScheduleId);

            if (schedule == null)
            {
                return NotFound(new { error = "Schedule not found." });
            }

            schedule.Status = actionSchedule.Status;
            _context.Schedules.Update(schedule);

            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        private List<Schedule> GetAllSchedules()
        {
            return _context.Schedules
                .Include(s => s.Service)
                .Include(c => c.Customer)
                .Include(b => b.Barber).ToList();
        }

        private List<Schedule> GetScheduleByCondition(string status = null, int? barberId = null, int? scheduleId = null)
        {
            return GetAllSchedules().Where(s => (status == null ||s.Status == status)
                                              && (barberId == null || s.BarberId == barberId)
                                              && (scheduleId==null || s.ScheduleId == scheduleId))
                .ToList();
        }

        private async Task<Schedule> GetScheduleByIdAsync(int id)
        {
            return await _context.Schedules
                .Include(s => s.Service)
                .Include(c => c.Customer)
                .Include(b => b.Barber)
                .FirstOrDefaultAsync(s => s.ScheduleId == id);
        }


        [HttpGet]
        public IActionResult GetSchedules()
        {
            var schedules = GetScheduleByCondition(null, UserId); // Fetch updated data
            return PartialView("_ScheduleTable", schedules); // Return the partial view
        }

     
        [HttpPost]
        public async Task<IActionResult> GetFilteredSchedules([FromBody] ScheduleFilter filter)
        {
            // Get the filtered schedules based on the filter
            var schedules = GetSchedulesByCondition(filter);

            if (schedules == null || !schedules.Any())
            {
                return Json(new { error = "Schedules not found." });
            }

            // Return success response
            return PartialView("_ScheduleTable", schedules);
        }

        private List<Schedule> GetSchedulesByCondition(ScheduleFilter filter)
        {
            return GetAllSchedules()
                .Where(s =>
                    (filter.Status == null || s.Status == filter.Status) &&
                    (filter.BarberId == null || s.BarberId == filter.BarberId) &&
                    (filter.Date == null || s.StartTime.Date == filter.Date.Value.Date)
                )
                .ToList();
        }

    }
}