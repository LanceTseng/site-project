using System;
using SQLite;

namespace MobileProject.Model
{
    [Table("order")]
    public class Order : BaseModel
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string TransactionCode { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; }

        public Order()
        {
        }

    }
}