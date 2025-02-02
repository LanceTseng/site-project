using MobileProject.API.Models;

namespace MobileProject.API.Repositories.Interfaces;

public interface IOrdersRepository
{
    Task<IEnumerable<Order>> GetAllOrdersAsync();

    Task<Order?> GetProductByIdAsync(int id);

    Task<IEnumerable<Order>> GetOrdersByConditionAsync(
        string? userName, string? transactionCode, string? status,
        int userId = 0, DateTime? dateFrom = null, DateTime? dateTo = null);

    Task<Response> CreateOrderAsync(Order order);

    Task<Response> UpdateOrderAsync(Order order);

    Task<Response> DeleteOrderAsync(int id);
}