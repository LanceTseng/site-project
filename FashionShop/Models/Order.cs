namespace FashionShop.Models;

public class Order
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public string Status { get; set; }
    public decimal SubTotal { get; set; }
    public DateTime PlaceOrderDate { get; set; }
}