using System.Text;
using Dapper;
using Microsoft.Data.SqlClient;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

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
            StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
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
            StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
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
            StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
            StatusMessage = result > 0 ? "Cart record deleted successfully" : "Failed to delete cart record"
        };
    }

    public async Task<IEnumerable<CartRecord>> GetCartRecordsByConditionAsync(
        string? userName = null,
        string? productName = null,
        string? status = null,
        int userId = 0,
        DateTime? dateFrom = null,
        DateTime? dateTo = null)
    {
        using var connection = new SqlConnection(_connectionString);

        var query = new StringBuilder(@"
        SELECT cr.*
        FROM cart_record cr
        JOIN users u ON cr.UserId = u.Id
        JOIN products p ON cr.ProductId = p.Id
        WHERE (@UserName IS NULL OR u.UserName LIKE @UserName)
        AND (@ProductName IS NULL OR p.Name LIKE @ProductName)
        AND (@Status IS NULL OR cr.Status = @Status)
        AND (@UserId = 0 OR cr.UserId = @UserId)
        AND (@DateFrom IS NULL OR cr.CreatedDate >= @DateFrom)
        AND (@DateTo IS NULL OR cr.CreatedDate <= @DateTo)");

        var parameters = new DynamicParameters();
        parameters.Add("@UserName", userName);
        parameters.Add("@ProductName", productName);
        parameters.Add("@Status", status);
        parameters.Add("@UserId", userId);
        parameters.Add("@DateFrom", dateFrom);
        parameters.Add("@DateTo", dateTo);

        return await connection.QueryAsync<CartRecord>(query.ToString(), parameters);
    }
}