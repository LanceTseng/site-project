using MobileProject.API.Models;

namespace MobileProject.API.Repositories.Interfaces;

public interface ICartRecordRepository
{
    Task<IEnumerable<CartRecord>> GetAllCartRecordsAsync();

    Task<CartRecord?> GetCartRecordByIdAsync(int id);

    Task<IEnumerable<CartRecord>> GetCartRecordsByConditionAsync(string? userName, string? productName, string? status, int? userId, string? transactionCode);

    Task<Response> CreateCartRecordAsync(CartRecord cartRecord);

    Task<Response> UpdateCartRecordAsync(CartRecord cartRecord);

    Task<Response> DeleteCartRecordAsync(int id);
}