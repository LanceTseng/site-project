using System.Text;
using Dapper;
using Microsoft.Data.SqlClient;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using StatusCodes = MobileProject.API.Models.StatusCodes;

namespace MobileProject.API.Repositories;

public class CartRecordRepository : ICartRecordRepository
{
    private readonly string _connectionString;

    public CartRecordRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<IEnumerable<CartRecord>> GetAllCartRecordsAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<CartRecord>("SELECT * FROM cart_record");
    }

    public async Task<CartRecord?> GetCartRecordByIdAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);
        return await connection.QueryFirstOrDefaultAsync<CartRecord>(
            "SELECT * FROM cart_record WHERE Id = @Id", parameters);
    }

    public async Task<Response> CreateCartRecordAsync(CartRecord cartRecord)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        parameters.Add("@Qty", cartRecord.Qty);
        parameters.Add("@Total", cartRecord.Total);
        parameters.Add("@ProductId", cartRecord.ProductId);
        parameters.Add("@UserId", cartRecord.UserId);
        parameters.Add("@Status", cartRecord.Status);
        parameters.Add("@TransactionCode", cartRecord.TransactionCode);

        var result = await connection.ExecuteAsync(
            "INSERT INTO cart_record (Qty, Total, ProductId, UserId, Status, TransactionCode) " +
            "VALUES (@Qty, @Total, @ProductId, @UserId, @Status, @TransactionCode)", parameters);

        return new Response
        {
            StatusCode = result > 0 ? StatusCodes.Success : StatusCodes.ServerError,
            StatusMessage = result > 0 ? "Cart record created successfully" : "Failed to create cart record"
        };
    }

    public async Task<Response> UpdateCartRecordAsync(CartRecord cartRecord)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        parameters.Add("@Qty", cartRecord.Qty);
        parameters.Add("@Total", cartRecord.Total);
        parameters.Add("@Status", cartRecord.Status);
        parameters.Add("@TransactionCode", cartRecord.TransactionCode);
        parameters.Add("@Id", cartRecord.Id);

        var result = await connection.ExecuteAsync(
            "UPDATE cart_record SET Qty = @Qty, Total = @Total, Status = @Status, TransactionCode = @TransactionCode " +
            "WHERE Id = @Id", parameters);

        return new Response
        {
            StatusCode = result > 0 ? StatusCodes.Success : StatusCodes.ServerError,
            StatusMessage = result > 0 ? "Cart record updated successfully" : "Failed to update cart record"
        };
    }

    public async Task<Response> DeleteCartRecordAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);

        var result = await connection.ExecuteAsync(
            "DELETE FROM cart_record WHERE Id = @Id", parameters);

        return new Response
        {
            StatusCode = result > 0 ? StatusCodes.Success : StatusCodes.ServerError,
            StatusMessage = result > 0 ? "Cart record deleted successfully" : "Failed to delete cart record"
        };
    }

    public async Task<IEnumerable<CartRecord>> GetCartRecordsByConditionAsync(string? userName, string? productName, string? status, DateTime? dateFrom, DateTime? dateTo)
    {
        using var connection = new SqlConnection(_connectionString);

        // Building the query with conditions based on parameters
        var query = new StringBuilder("SELECT cr.* FROM cart_record cr ");
        query.Append("JOIN users u ON cr.UserId = u.Id ");
        query.Append("JOIN products p ON cr.ProductId = p.Id ");
        query.Append("WHERE 1=1 "); // Ensuring the WHERE clause starts correctly

        var parameters = new DynamicParameters();

        // Add conditions to the query based on the provided parameters
        if (!string.IsNullOrEmpty(userName))
        {
            query.Append("AND u.UserName LIKE @UserName ");
            parameters.Add("@UserName", "%" + userName + "%");
        }

        if (!string.IsNullOrEmpty(productName))
        {
            query.Append("AND p.Name LIKE @ProductName ");
            parameters.Add("@ProductName", "%" + productName + "%");
        }

        if (!string.IsNullOrEmpty(status))
        {
            query.Append("AND cr.Status = @Status ");
            parameters.Add("@Status", status);
        }

        if (dateFrom.HasValue)
        {
            query.Append("AND cr.CreatedDate >= @DateFrom ");
            parameters.Add("@DateFrom", dateFrom.Value);
        }

        if (dateTo.HasValue)
        {
            query.Append("AND cr.CreatedDate <= @DateTo ");
            parameters.Add("@DateTo", dateTo.Value);
        }

        // Execute the query and return the results
        return await connection.QueryAsync<CartRecord>(query.ToString(), parameters);
    }
}