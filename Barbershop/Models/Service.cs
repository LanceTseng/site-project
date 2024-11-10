namespace Barbershop.Models
{
    public class Service
    {
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public decimal Price { get; set; }

        public ICollection<Schedule> ServiceSchedules { get; set; }
    }
}
