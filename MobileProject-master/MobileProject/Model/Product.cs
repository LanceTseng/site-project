using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using SQLite;

namespace MobileProject.Model
{
    [Table("product")]
    public class Product : BaseModel
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        [MaxLength(500)]
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
