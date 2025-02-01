using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;

namespace MobileProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersRepository _ordersRepository;

        public OrdersController(IOrdersRepository ordersRepository)
        {
            _ordersRepository = ordersRepository;
        }

        // GET: api/Orders
        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _ordersRepository.GetAllOrdersAsync();
            return orders.Any() ? Ok(orders) : NotFound(new Response
            {
                StatusCode = StatusCodes.Status404NotFound,
                StatusMessage = "No orders found."
            });
        }

        // GET: api/Orders/{id}
        [HttpGet("GetOrderById/{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _ordersRepository.GetProductByIdAsync(id);
            return order != null ? Ok(order) : NotFound(new Response
            {
                StatusCode = StatusCodes.Status404NotFound,
                StatusMessage = "Order not found."
            });
        }

        // GET: api/Orders/GetByCondition
        [HttpGet("GetOrdersByCondition")]
        public async Task<IActionResult> GetOrdersByCondition([FromQuery] string? userName, [FromQuery] string? transactionCode, [FromQuery] string? status)
        {
            var orders = await _ordersRepository.GetOrdersByConditionAsync(userName, transactionCode, status);
            return orders.Any() ? Ok(orders) : NotFound(new Response
            {
                StatusCode = StatusCodes.Status404NotFound,
                StatusMessage = "No matching orders found."
            });
        }

        // POST: api/Orders
        [HttpPost("CreateOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (order == null)
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Invalid order data."
                });
            }

            var response = await _ordersRepository.CreateOrderAsync(order);
            return StatusCode(response.StatusCode, response);
        }

        // PUT: api/Orders/{id}
        [HttpPut("UpdateOrder")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (order == null || id != order.Id)
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Invalid order data."
                });
            }

            var response = await _ordersRepository.UpdateOrderAsync(order);
            return StatusCode(response.StatusCode, response);
        }

        // DELETE: api/Orders/{id}
        [HttpDelete("DeleteOrder/{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var response = await _ordersRepository.DeleteOrderAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}

