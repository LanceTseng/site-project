using Microsoft.AspNetCore.Mvc.Rendering;

namespace Barbershop.Models
{
    public class PaymentViewModel
    {
        public string PaymentType { get; set; }
        public int ScheduleId { get; set; }
        public decimal Total { get; set; }
        public decimal Tax { get; set; }
        public decimal TotalAmount { get; set; }
        public string CardLastDigit { get; set; }
        public decimal Tip { get; set; }
        public decimal TotalPaid { get; set; }
        public string TransactionCode { get; set; }
        public DateTime CreatedDate { get; set; }
        public List<Schedule> Schedules { get; set; }
    }

}
