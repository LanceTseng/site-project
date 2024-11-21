using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Barbershop.Models
{
    public class AppointmentView
    {

        public int ScheduleId { get; set; }
        public DateTime ScheduleDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Status { get; set; }

        // Customer details
        public int CustomerUserId { get; set; }
        public string CustomerUsername { get; set; }

        // Barber details
        public int BarberUserId { get; set; }
        public string BarberUsername { get; set; }

        // Service details
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public decimal Price { get; set; }

        // Order details
        public int? OrderId { get; set; } // Nullable
        public string? TransactionCode { get; set; } // Nullable
        public DateTime? OrderDate { get; set; } // Nullable
        public decimal? TotalAmount { get; set; } // Nullable
        public decimal? Tip { get; set; } // Nullable
        public string? PaymentType { get; set; } // Nullable
        public string? CardLastDigit { get; set; } // Nullable
    }

    public class AppointmentFilterViewModel
    {
        public List<SelectListItem> Barbers { get; set; }
        public List<SelectListItem> Customers { get; set; }
        public List<AppointmentView> HistoryList { get; set; }
    }
}
