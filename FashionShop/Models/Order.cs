using System.ComponentModel.DataAnnotations.Schema;

namespace FashionShop.Models;

public class Order
{
    public int Id { get; set; }
    public string CardCode { get; set; }
    public string Status { get; set; }
    public decimal SubTotal { get; set; }
    public DateTime PlaceOrderDate { get; set; }
    
    public ICollection<Cart> Carts { get; set; }
}