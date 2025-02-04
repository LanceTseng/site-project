namespace MobileProject.API.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string TransactionCode { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime Date { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; }
    }
}