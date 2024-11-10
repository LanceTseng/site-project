namespace Barbershop.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }

        // Schedules where this user is a customer or barber
        public ICollection<Schedule> CustomerSchedules { get; set; }
        public ICollection<Schedule> BarberSchedules { get; set; }
    }
}