using MobileProject.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace MobileProject.Service.Interface
{
    public interface IOverviewReportService
    {
        Task<IEnumerable<Overview>> GetAllOverviewAsync();

        Task<IEnumerable<Overview>> GetOverviewByConditionAsync(
            string userName = null,
            string role = null,
            string productName = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null
        );
    }
}