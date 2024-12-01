namespace FashionShop.Models;

public class Cart
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int UserId { get; set; }
    public int Qty { get; set; }
    public string Status { get; set; }
    public DateTime Created { get; set; }


    public User User { get; set; }
    public Product Product { get; set; }

    public string? CartCode { get; set; }
    public Order Order { get; set; }

}