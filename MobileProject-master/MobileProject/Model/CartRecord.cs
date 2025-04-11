namespace MobileProject.Model
{
    public class CartRecord : BaseModel
    {
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