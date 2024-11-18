namespace Barbershop.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string PaymentType  { get; set; }
        public int ScheduleId { get; set; }
        public decimal Total { get; set; }
        public decimal Tax { get; set; }
        public decimal Tip { get; set; }
        public string CardLastDigit { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalPaid { get; set; }
        public string TransactionCode { get; set; }
        public DateTime CreatedDate { get; set; }
        public Schedule Schedule { get; set; }

    }
}
