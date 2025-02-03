using System.Text;
using Dapper;
using Microsoft.Data.SqlClient;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;

namespace MobileProject.API.Repositories;

public class OverviewReportRepository : IOverviewReportRepository
{
    private readonly string _connectionString;

    public OverviewReportRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<IEnumerable<Overview>> GetAllOverviewAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        const string query = "select * from OverviewReport";
        return await connection.QueryAsync<Overview>(query);
    }

    public async Task<IEnumerable<Overview>> GetOverviewByConditionAsync(
        string? userName, string? role, string? productName, DateTime? dateFrom, DateTime? dateTo)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();

        var query = new StringBuilder(@"
                SELECT * FROM OverviewReport
                WHERE (@UserName IS NULL OR UserName LIKE '%' + @UserName + '%')
                AND (@Role IS NULL OR Role = @Role)
                AND (@ProductName IS NULL OR ProductName LIKE '%' + @ProductName + '%')
                ");

        parameters.Add("@UserName", userName);
        parameters.Add("@Role", role);
        parameters.Add("@ProductName", productName);
        if (dateFrom.HasValue && dateFrom.Value >= new DateTime(1753, 1, 1))
        {
            query.Append(" AND CAST(OrderDate AS DATE) >= @DateFrom");
            parameters.Add("@DateFrom", dateFrom.Value.Date);
        }

        if (dateTo.HasValue && dateTo.Value >= new DateTime(1753, 1, 1))
        {
            query.Append(" AND CAST(OrderDate AS DATE) <= @DateTo");
            parameters.Add("@DateTo", dateTo.Value.Date);
        }

        return await connection.QueryAsync<Overview>(query.ToString(), parameters);
    }
}