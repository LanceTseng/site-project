using System;
using System.Collections.Generic;
using System.Text;
using MobileProject.Model;

namespace MobileProject.DummyData
{
    public class DummyData
    {
         
        public List<Product> Products { get; set; } = new List<Product>()
        {
            new Product()
            {
                Image =  "default1.png",
                Name = "Rice and Curry",
                Description = "Basmati rice with 3 veggie curries and 1 meat curry",
                Price = 10.00m,
                Date = DateTime.Today
            },
            new Product()
            {
                Image =  "default1.png",
                Name = "Fried Rice with Devilled Chicken",
                Description = "Fried Rice with spicy chicken with tomato sauce",
                Price = 12.00m,
                Date = DateTime.Today
            },
            new Product()
            {
                Image =  "default1.png",
                Name = "Koththu Roti",
                Description = "Chopped Roti with mixed gravy and vegetables",
                Price = 12.50m,
                Date = DateTime.Today
            },
            new Product()
            {
                Image = "default1.png",
                Name = "Coconut Roti",
                Description = "Roti made out of coconut flour served with sambal",
                Price = 8.00m,
                Date = DateTime.Today
            },
            new Product()
            {
                Image =  "default1.png",
                Name = "Milk Rice",
                Description = "Blocks of Rice mixed with milk served with chilli sambal",
                Price = 9.00m,
                Date = DateTime.Today
            },
            new Product()
            {
                Image =  "default1.png",
                Name = "Hot butter Cuttlefish",
                Description = "Spicy calamari deep fried with a batter",
                Price = 14.00m,
                Date = DateTime.Today
            },
            new Product()
            {
                Image =  "default1.png",
                Name = "Samosa",
                Description = "A pastry made with spicy vegetables inside",
                Price = 5.00m,
                Date = DateTime.Today
            }
        };
    }
}