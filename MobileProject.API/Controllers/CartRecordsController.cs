using Microsoft.AspNetCore.Mvc;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace MobileProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartRecordController : ControllerBase
    {
        private readonly ICartRecordRepository _cartRecordRepository;

        public CartRecordController(ICartRecordRepository cartRecordRepository)
        {
            _cartRecordRepository = cartRecordRepository;
        }

        [HttpGet("GetAllCartRecords")]
        public async Task<IActionResult> GetAllCartRecords()
        {
            var cartRecords = await _cartRecordRepository.GetAllCartRecordsAsync();
            if (!cartRecords.Any())
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "No cart records found."
                });
            }
            return Ok(cartRecords);
        }

        [HttpGet("GetCartRecordById/{id}")]
        public async Task<IActionResult> GetCartRecordById(int id)
        {
            var cartRecord = await _cartRecordRepository.GetCartRecordByIdAsync(id);
            if (cartRecord == null)
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "Cart record not found."
                });
            }
            return Ok(cartRecord);
        }

        [HttpGet("GetCartRecordByCondition")]
        public async Task<IActionResult> GetCartRecordsByUserId(string? userName, string? productName, string? status, DateTime? dateFrom, DateTime? dateTo)
        {
            var cartRecords = await _cartRecordRepository.GetCartRecordsByConditionAsync(userName, productName, status, dateFrom, dateTo);
            if (!cartRecords.Any())
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "No cart records found for the user."
                });
            }
            return Ok(cartRecords);
        }

        [HttpPost("CreateCartRecord")]
        public async Task<IActionResult> CreateCartRecord([FromBody] CartRecord cartRecord)
        {
            if (cartRecord == null)
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Invalid user data."
                });
            }

            var response = await _cartRecordRepository.CreateCartRecordAsync(cartRecord);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("UpdateCartRecord")]
        public async Task<IActionResult> UpdateCartRecord([FromBody] CartRecord cartRecord)
        {
            if (cartRecord == null || cartRecord.Id <= 0) 
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Cart record ID mismatch."
                });
            }
            var response = await _cartRecordRepository.UpdateCartRecordAsync(cartRecord);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("DeleteCartRecord/{id}")]
        public async Task<IActionResult> DeleteCartRecord(int id)
        {
            var response = await _cartRecordRepository.DeleteCartRecordAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}