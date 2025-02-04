namespace MobileProject.API.Models
{
    public class CartRecord
    {
        public int Id { get; set; }
        public decimal Qty { get; set; }
        public decimal Total { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string Status { get; set; }
        public string TransactionCode { get; set; }
    }
}