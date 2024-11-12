using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Barbershop.Models
{
    public class SchedulingViewModel
    {
        [Required(ErrorMessage = "Please select a barber.")]
        public int BarberId { get; set; }

        [Required(ErrorMessage = "Please select a service.")]
        public int ServiceId { get; set; }

        [Required(ErrorMessage = "Please select a date.")]
        [DataType(DataType.Date)]
        public DateTime AppointmentDate { get; set; }

        [Required(ErrorMessage = "Please select a start time.")]
        public string StartTime { get; set; }

        [Required(ErrorMessage = "Please select an end time.")]
        public string EndTime { get; set; }

        public List<SelectListItem> BarberList { get; set; }
        public List<SelectListItem> ServiceList { get; set; }
        public List<string> AvailableTimes { get; set; }
        public ScheduleConfirmation ConfirmationDetails { get; set; }
    }
    public class ScheduleConfirmation
    {
        public string CustomerName { get; set; }
        public string BarberName { get; set; }
        public string ServiceName { get; set; }
        public decimal ServicePrice { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
    }
}
