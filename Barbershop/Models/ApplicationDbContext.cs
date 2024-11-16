using Microsoft.EntityFrameworkCore;

namespace Barbershop.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRole>().HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // Configure Customer relationship
            modelBuilder.Entity<Schedule>()
                .HasOne(s => s.Customer)
                .WithMany(u => u.CustomerSchedules)
                .HasForeignKey(s => s.CustomerId)
                .OnDelete(DeleteBehavior.Restrict); // Optional: prevents cascading delete

            // Configure Barber relationship
            modelBuilder.Entity<Schedule>()
                .HasOne(s => s.Barber)
                .WithMany(u => u.BarberSchedules)
                .HasForeignKey(s => s.BarberId)
                .OnDelete(DeleteBehavior.Restrict); // Optional: prevents cascading delete

            // Configure Service relationship
            modelBuilder.Entity<Schedule>()
                .HasOne(s => s.Service)
                .WithMany(sv => sv.ServiceSchedules)
                .HasForeignKey(s => s.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}