using System;

namespace MobileProject.Model
{
    public class Product : BaseModel
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public DateTime Date { get; set; }
        public string Image { get; set; }

        public Product()
        {
        }
    }
}