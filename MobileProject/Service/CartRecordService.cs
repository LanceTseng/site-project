using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using MobileProject.Model;
using MobileProject.Service.Interface;

namespace MobileProject.Service
{
    public class CartRecordService : ICartRecordService
    {
        private const string BaseUrl = "api/CartRecords";
        private readonly ApiService _apiService;

        public CartRecordService(ApiService apiService)
        {
            _apiService = apiService;
        }

        // Get all cart records
        public async Task<IEnumerable<CartRecord>> GetAllCartRecordsAsync()
        {
            return await _apiService.CallApiAsync<IEnumerable<CartRecord>>($"{BaseUrl}/GetAllCartRecords", HttpMethod.Get);
        }

        public async Task<IEnumerable<CartRecord>> GetCartRecordsByConditionAsync(string userName = null, string productName = null, string status = null, int userId = 0,
            DateTime dateFrom = new DateTime(), DateTime dateTo = new DateTime())
        {
            // Build the query string dynamically
            var query = $"?userName={userName}&productName={productName}&status={status}&dateFrom={dateFrom:yyyy-MM-dd}&dateTo={dateTo:yyyy-MM-dd}";

            return await _apiService.CallApiAsync<IEnumerable<CartRecord>>($"{BaseUrl}/GetCartRecordsByCondition{query}", HttpMethod.Get);
        }

        // Get a cart record by its ID
        public async Task<CartRecord> GetCartRecordByIdAsync(int id)
        {
            return await _apiService.CallApiAsync<CartRecord>($"{BaseUrl}/GetCartRecordById/{id}", HttpMethod.Get);
        }

        // Create a new cart record
        public async Task<CartRecord> CreateCartRecordAsync(CartRecord cartRecord)
        {
            return await _apiService.CallApiAsync<CartRecord>($"{BaseUrl}/CreateCartRecord", HttpMethod.Post, cartRecord);
        }

        // Update an existing cart record
        public async Task<CartRecord> UpdateCartRecordAsync(CartRecord cartRecord)
        {
            return await _apiService.CallApiAsync<CartRecord>($"{BaseUrl}/UpdateCartRecord", HttpMethod.Put, cartRecord);
        }

        // Delete a cart record by its ID
        public async Task<bool> DeleteCartRecordAsync(int id)
        {
            return await _apiService.CallApiAsync<bool>($"{BaseUrl}/DeleteCartRecord/{id}", HttpMethod.Delete);
        }
    }
}