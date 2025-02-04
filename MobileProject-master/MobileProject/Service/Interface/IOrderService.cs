using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MobileProject.Model;

namespace MobileProject.Service.Interface
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();

        Task<IEnumerable<Order>> GetOrdersByConditionAsync(string userName = null, string transactionCode = null,
            string status = null, int? userId = null, DateTime? dateFrom =null, DateTime? dateTo = null);

        Task<Order> GetOrderByIdAsync(int id);

        Task<Order> CreateOrderAsync(Order order);

        Task<Order> UpdateOrderAsync(Order order);

        Task<bool> DeleteOrderAsync(int id);
    }
}