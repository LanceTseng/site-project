using Dapper;
using Microsoft.Data.SqlClient;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace MobileProject.API.Repositories;

public class OrdersRepository : IOrdersRepository
{
    private readonly string _connectionString;

    public OrdersRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        const string query = "SELECT * FROM orders";
        return await connection.QueryAsync<Order>(query);
    }

    public async Task<Order?> GetProductByIdAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        const string query = "SELECT * FROM orders WHERE Id = @Id";
        return await connection.QueryFirstOrDefaultAsync<Order>(query, new { Id = id });
    }

    public async Task<IEnumerable<Order>> GetOrdersByConditionAsync(string? userName, string? transactionCode, string? status)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        var query = "SELECT o.* FROM orders o JOIN users u ON o.UserId = u.Id WHERE 1=1";

        if (!string.IsNullOrEmpty(userName))
        {
            query += " AND u.Name LIKE '%' + @UserName + '%'";
            parameters.Add("@UserName", userName);
        }

        if (!string.IsNullOrEmpty(transactionCode))
        {
            query += " AND o.TransactionCode = @TransactionCode";
            parameters.Add("@TransactionCode", transactionCode);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query += " AND o.Status = @Status";
            parameters.Add("@Status", status);
        }

        return await connection.QueryAsync<Order>(query, parameters);
    }

    public async Task<Response> CreateOrderAsync(Order order)
    {
        using var connection = new SqlConnection(_connectionString);
        const string query = @"
            INSERT INTO orders (TransactionCode, Subtotal, Date, UserId, Status)
            VALUES (@TransactionCode, @Subtotal, @Date, @UserId, @Status);
            SELECT CAST(SCOPE_IDENTITY() AS INT);";

        var newOrderId = await connection.ExecuteScalarAsync<int>(query, order);

        return new Response
        {
            StatusCode = StatusCodes.Status201Created,
            StatusMessage = "Order created successfully."
        };
    }

    public async Task<Response> UpdateOrderAsync(Order order)
    {
        using var connection = new SqlConnection(_connectionString);
        const string query = @"
            UPDATE orders
            SET TransactionCode = @TransactionCode, Subtotal = @Subtotal, Date = @Date,
                UserId = @UserId, Status = @Status
            WHERE Id = @Id";

        var rowsAffected = await connection.ExecuteAsync(query, order);

        return rowsAffected > 0
            ? new Response { StatusCode = StatusCodes.Status200OK, StatusMessage = "Order updated successfully." }
            : new Response { StatusCode = StatusCodes.Status404NotFound, StatusMessage = "Order not found." };
    }

    public async Task<Response> DeleteOrderAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        const string query = "DELETE FROM orders WHERE Id = @Id";

        var rowsAffected = await connection.ExecuteAsync(query, new { Id = id });

        return rowsAffected > 0
            ? new Response { StatusCode = StatusCodes.Status200OK, StatusMessage = "Order deleted successfully." }
            : new Response { StatusCode = StatusCodes.Status404NotFound, StatusMessage = "Order not found." };
    }
}