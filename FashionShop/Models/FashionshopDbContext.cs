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

    }
}
