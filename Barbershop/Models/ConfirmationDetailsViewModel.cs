namespace Barbershop.Models
{
    public class ConfirmationDetailsViewModel
    {
        public string CustomerName { get; set; }
        public string BarberName { get; set; }
        public string ServiceName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
    }
}
