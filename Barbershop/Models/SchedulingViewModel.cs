using Microsoft.AspNetCore.Mvc.Rendering;

namespace Barbershop.Models
{
    public class SchedulingViewModel
    {
        public int BarberId { get; set; }
        public int ServiceId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string StartTime { get; set; }
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
        public DateTime AppointmentDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
    }
}
