using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MobileProject.Model;

namespace MobileProject.Service.Interface
{
    public interface ICartRecordService
    {
        Task<IEnumerable<CartRecord>> GetAllCartRecordsAsync();

        Task<IEnumerable<CartRecord>> GetCartRecordsByConditionAsync(string userName = null, string productName = null,
            string status = null, int userId = 0, DateTime dateFrom = new DateTime(), DateTime dateTo = new DateTime());

        Task<CartRecord> GetCartRecordByIdAsync(int id);

        Task<CartRecord> CreateCartRecordAsync(CartRecord cartRecord);

        Task<CartRecord> UpdateCartRecordAsync(CartRecord cartRecord);

        Task<bool> DeleteCartRecordAsync(int id);
    }
}