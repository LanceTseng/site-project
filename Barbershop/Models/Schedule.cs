namespace Barbershop.Models;

public class Schedule
{

    public int ScheduleId { get; set; }

    // Foreign keys
    public int CustomerId { get; set; }
    public int BarberId { get; set; }
    public int ServiceId { get; set; }

    // Navigation properties
    public User Customer { get; set; }
    public User Barber { get; set; }
    public Service Service { get; set; }

    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public string Status { get; set; }
}