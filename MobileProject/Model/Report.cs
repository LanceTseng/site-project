using System;
using System.Collections.Generic;
using System.Text;

namespace MobileProject.Model
{
    public class Report
    {
    }

    public class Overview
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Role { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public int OrderId { get; set; }
        public string TransactionCode { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderStatus { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public string ProductImage { get; set; }
    }

    //public class ProductSalesData
    //{
    //    public string ProductName { get; set; }
    //    public float TotalPrice { get; set; }
    //    public decimal Quantity { get; set; }
    //}

    //public class UserSalesData
    //{
    //    public string UserName { get; set; }
    //    public decimal TotalPrice { get; set; }
    //}
}
