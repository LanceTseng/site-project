namespace Barbershop.Models
{
    public class Order
    {
        public int OrderId { get; set; }
        public string PaymentType  { get; set; }
        public int ScheduleId { get; set; }
        public decimal AdditionalFee { get; set; }
        public decimal Total { get; set; }
        public decimal Tax { get; set; }
        public decimal SubTotal { get; set; }
        public int? CardLastDigit { get; set; }
        public int TotalPaid { get; set; }
        public DateTime CreatedDate { get; set; }
        public Schedule Schedule { get; set; }

    }
}
