using Microsoft.EntityFrameworkCore;

namespace FashionShop.Models
{
    public class FashionshopDbContext : DbContext
    {
        public FashionshopDbContext(DbContextOptions<FashionshopDbContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cart>()
                .HasOne(c => c.Order)
                .WithMany(o => o.Carts)
                .HasForeignKey(c => c.CartCode) // CartCode acts as the foreign key
                .HasPrincipalKey(o => o.CardCode) // CartCode is the principal key in Order
                .OnDelete(DeleteBehavior.Cascade); // Optional: Define cascading behavior

            modelBuilder.Entity<Order>()
                .HasIndex(o => o.CardCode)
                .IsUnique(); // Ensure CartCode is unique in Order
        }

    }
}
