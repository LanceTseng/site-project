using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Barbershop.Models
{
    public class ApprovalViewModel 
    {
        public ScheduleFilter Filter { get; set; }
        public List<SelectListItem> Barbers { get; set; }
        public List<Schedule> Schedules { get; set; }

    }
    public class ScheduleFilter
    {
        public int? BarberId { get; set; }
        public DateTime? Date { get; set; }
        public string Status { get; set; }
    }

    public class ActionSchedule()
    {
        public int ScheduleId { get; set; }
        public string Status { get; set; }
    }

}