using System.Security.Cryptography;
using System.Text;
using System.Transactions;
using Barbershop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;

namespace Barbershop.Controllers
{
    public class PaymentController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var model = new PaymentViewModel()
            {
                Schedules = GetScheduleList(),
                TransactionCode = GenerateSecureRandomString(6),

            };
            return View("Payment", model);
        }

        public static string GenerateSecureRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var result = new StringBuilder(length);
            using (var rng = RandomNumberGenerator.Create())
            {
                byte[] randomBytes = new byte[length];
                rng.GetBytes(randomBytes);

                foreach (byte randomByte in randomBytes)
                {
                    result.Append(chars[randomByte % chars.Length]);
                }
            }

            return result.ToString();
        }

        public List<Schedule> GetScheduleList()
        {
            return _context.Schedules
                .Where(s => s.Status == "New")
                .Include(s => s.Service) 
                .Include(s=>s.Barber)
                .Include(s=>s.Customer)// Include related services
                .ToList();
        }

        [HttpGet]
        public async Task<IActionResult> GetServicesBySchedule(int scheduleId)
        {
            if (scheduleId <= 0)
            {
                return BadRequest("Invalid schedule ID.");
            }

            var schedule = _context.Schedules.Find(scheduleId);

            // Query the services associated with the provided schedule ID
            var services = await _context.Services
                .Where(s => s.ServiceId == schedule.ServiceId)
                .Select(s => new
                {
                    s.ServiceName,
                    s.Price
                })
                .ToListAsync();

            if (services == null || !services.Any())
            {
                return NotFound("No services found for the specified schedule.");
            }

            return Json(services);
        }

        [HttpPost]
        public async Task<IActionResult> PlaceOrder([FromBody] PaymentViewModel order)
        {
            if (order == null || order.ScheduleId <= 0 || order.TotalAmount <= 0)
            {
                return BadRequest("Invalid order details.");
            }
            var schedule = await _context.Schedules.FindAsync(order.ScheduleId);

            var model = new Order
            {
                PaymentType = order.PaymentType, // Replace with actual value
                ScheduleId = order.ScheduleId, // Replace with actual value
                Total = order.Total, // Replace with actual value
                Tax = order.Tax, // Replace with actual value
                Tip = order.Tip, // Replace with actual value
                CardLastDigit = order.CardLastDigit, // Replace with actual value or null
                TotalAmount = order.TotalAmount, // Replace with actual value
                TotalPaid = order.TotalPaid, // Replace with actual value
                TransactionCode = order.TransactionCode, // Replace with actual value
                CreatedDate = DateTime.UtcNow, // Replace with actual value
            };

            _context.Orders.Add(model);
            _context.SaveChangesAsync();

            var response = _context.Orders.FirstOrDefaultAsync(o => o.TransactionCode == order.TransactionCode);
            if (response == null)
            {
                return BadRequest("Invalid TransactionCode provided.");
            }

            schedule.Status = "Closed";
            _context.SaveChangesAsync();

            // Return the result
            return Ok(new
            {
                order.TransactionCode
            }.ToJson());
        }

    }
}
