using System.Text;
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

    public async Task<IEnumerable<Order>> GetOrdersByConditionAsync(
        string? userName, string? transactionCode, string? status,
        int userId = 0, DateTime? dateFrom = null, DateTime? dateTo = null)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();

        var query = new StringBuilder(@"
        SELECT o.* FROM orders o
        JOIN users u ON o.UserId = u.Id
        WHERE (@UserName IS NULL OR u.Name LIKE '%' + @UserName + '%')
        AND (@TransactionCode IS NULL OR o.TransactionCode = @TransactionCode)
        AND (@Status IS NULL OR o.Status = @Status)
        AND (@UserId = 0 OR o.UserId = @UserId)
        AND (@DateFrom IS NULL OR o.CreatedDate >= @DateFrom)
        AND (@DateTo IS NULL OR o.CreatedDate <= @DateTo)");

        parameters.Add("@UserName", userName);
        parameters.Add("@TransactionCode", transactionCode);
        parameters.Add("@Status", status);
        parameters.Add("@UserId", userId);
        parameters.Add("@DateFrom", dateFrom);
        parameters.Add("@DateTo", dateTo);

        return await connection.QueryAsync<Order>(query.ToString(), parameters);
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