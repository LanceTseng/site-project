using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using MobileProject.Model;
using MobileProject.Service.Interface;

namespace MobileProject.Service
{
    public class OrderService : IOrderService
    {
        private string BaseUrl = @"api/Orders";
        private readonly ApiService _apiService;

        public OrderService(ApiService apiService)
        {
            _apiService = apiService;
        }

        // Get all orders
        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _apiService.CallApiAsync<IEnumerable<Order>>($"{BaseUrl}/GetAllOrders", HttpMethod.Get);
        }

        // Get orders based on conditions (userName, transactionCode, status, date range, userId)
        public async Task<IEnumerable<Order>> GetOrdersByConditionAsync(
            string userName = null,
            string transactionCode = null,
            string status = null,
            int userId = 0,
            DateTime dateFrom = new DateTime(),
            DateTime dateTo = new DateTime())
        {
            var query = $"?userName={userName}&transactionCode={transactionCode}&status={status}&userId={userId}&dateFrom={dateFrom}&dateTo={dateTo}";
            return await _apiService.CallApiAsync<IEnumerable<Order>>($"{BaseUrl}/GetOrdersByCondition{query}", HttpMethod.Get);
        }

        // Get order by ID
        public async Task<Order> GetOrderByIdAsync(int id)
        {
            return await _apiService.CallApiAsync<Order>($"{BaseUrl}/GetOrderById/{id}", HttpMethod.Get);
        }

        // Create a new order
        public async Task<Order> CreateOrderAsync(Order order)
        {
            return await _apiService.CallApiAsync<Order>($"{BaseUrl}/CreateOrder", HttpMethod.Post, order);
        }

        // Update an existing order
        public async Task<Order> UpdateOrderAsync(Order order)
        {
            return await _apiService.CallApiAsync<Order>($"{BaseUrl}/UpdateOrder", HttpMethod.Put, order);
        }

        // Delete an order by ID
        public async Task<bool> DeleteOrderAsync(int id)
        {
            return await _apiService.CallApiAsync<bool>($"{BaseUrl}/DeleteOrder/{id}", HttpMethod.Delete);
        }
    }
}