using System.Runtime.InteropServices.JavaScript;
using MobileProject.API.Models;

namespace MobileProject.API.Repositories.Interfaces;

public interface IOverviewReportRepository
{
    Task<IEnumerable<Overview>> GetAllOverviewAsync();

    Task<IEnumerable<Overview>> GetOverviewByConditionAsync(string? userName, string? role, string? productName,
        DateTime? dateFrom, DateTime? dateTo);
}