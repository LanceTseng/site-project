using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;

namespace MobileProject.API.Controllers.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class OverviewReportController : ControllerBase
    {
        private readonly IOverviewReportRepository _overviewReportRepository;

        public OverviewReportController(IOverviewReportRepository overviewReportRepository)
        {
            _overviewReportRepository = overviewReportRepository;
        }

        [HttpGet("GetAllOverviewReport")]
        public async Task<IActionResult> GetAllOverviewReport()
        {
            var report = await _overviewReportRepository.GetAllOverviewAsync();
            return report.Any() ? Ok(report) : NotFound(new Response
            {
                StatusCode = StatusCodes.Status404NotFound,
                StatusMessage = "No data found."
            });
        }

        [HttpGet("GetOverviewReportByCondition")]
        public async Task<IActionResult> GetOverviewReportByCondition(
            [FromQuery] string? userName,
            [FromQuery] string? role,
            [FromQuery] string? productName,
            [FromQuery] DateTime? dateFrom,
            [FromQuery] DateTime? dateTo)
        {
            var report = await _overviewReportRepository.GetOverviewByConditionAsync(userName, role, productName, dateFrom, dateTo);
            return report.Any()
                ? Ok(report)
                : NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "No data found."
                });
        }

    }
}
