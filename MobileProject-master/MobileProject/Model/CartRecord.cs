using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace MobileProject.Model
{
    [Table("cart_record")]
    public class CartRecord : BaseModel
    {
        [PrimaryKey, AutoIncrement, Column("ID")]
        public int Id { get; set; }

        //[MaxLength(500)]
        //public string Name { get; set; }
        //public decimal Price { get; set; }
        public decimal Qty { get; set; }
        public decimal Total { get; set; }
        //public string Image { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; }
        public string TransactionCode { get; set; }

        public CartRecord()
        {
        }
    }

    
}
