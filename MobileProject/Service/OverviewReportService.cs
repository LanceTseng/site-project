using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
using MobileProject.Model;
using MobileProject.Service.Interface;

namespace MobileProject.Service
{
    public class OverviewReportService : IOverviewReportService
    {

        private string BaseUrl = @"api/OverviewReport";
        private readonly ApiService _apiService;

        public OverviewReportService(ApiService apiService)
        {
            _apiService = apiService;
        }


        public async Task<IEnumerable<Overview>> GetAllOverviewAsync()
        {
            return await _apiService.CallApiAsync<IEnumerable<Overview>>($"{BaseUrl}/GetAllOverviewReport",
                HttpMethod.Get);
        }

        public async Task<IEnumerable<Overview>> GetOverviewByConditionAsync(string userName = null, string role = null, string productName = null,
            DateTime? dateFrom = null, DateTime? dateTo = null)
        {
            var query = new StringBuilder();

            if (!string.IsNullOrEmpty(userName))
                query.Append($"userName={Uri.EscapeDataString(userName)}&");

            if (!string.IsNullOrEmpty(role))
                query.Append($"role={Uri.EscapeDataString(role)}&");

            if (!string.IsNullOrEmpty(productName))
                query.Append($"productName={Uri.EscapeDataString(productName)}&");

            if (dateFrom.HasValue)
                query.Append($"dateFrom={dateFrom.Value:yyyy-MM-dd}&");

            if (dateTo.HasValue)
                query.Append($"dateTo={dateTo.Value:yyyy-MM-dd}&");

            // Only append "?" if query string has any parameters
            var queryString = query.Length > 0 ? "?" + query.ToString().TrimEnd('&') : "";

            return await _apiService.CallApiAsync<IEnumerable<Overview>>($"{BaseUrl}/GetOverviewReportByCondition{queryString}",
                HttpMethod.Get);
        }
    }
}