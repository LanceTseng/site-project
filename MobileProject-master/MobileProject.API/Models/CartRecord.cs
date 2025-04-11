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

    public class CartRecordView
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Qty { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; }
        public string TransactionCode { get; set; }
    }
}