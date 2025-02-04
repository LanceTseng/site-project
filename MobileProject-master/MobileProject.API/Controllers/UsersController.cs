using Microsoft.AspNetCore.Mvc;
using MobileProject.API.Models;
using MobileProject.API.Repositories;
using MobileProject.API.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace MobileProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _userRepository;

        public UsersController(IUsersRepository userRepository) // Use Dependency Injection
        {
            _userRepository = userRepository;
        }

        // GET: api/Users/GetAllUsers
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();

            if (!users.Any())
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "No users found."
                });
            }

            return Ok(users);
        }

        // GET: api/Users/GetUsersByCondition
        [HttpGet("GetUsersByCondition")]
        public async Task<IActionResult> GetUsersByCondition(
            [FromQuery] string? userName,
            [FromQuery] string? password,
            [FromQuery] string? email,
            [FromQuery] string? phone,
            [FromQuery] string? role)
        {
            var users = await _userRepository.GetUsersByConditionAsync(userName, password, email, phone, role);

            if (!users.Any())
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "No users found matching the criteria."
                });
            }

            return Ok(users);
        }

        // GET: api/Users/GetUserById/{id}
        [HttpGet("GetUserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "User not found."
                });
            }

            return Ok(user);
        }

        // POST: api/Users/CreateUser
        [HttpPost("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Invalid user data."
                });
            }

            var response = await _userRepository.CreateUserAsync(user);
            return StatusCode(response.StatusCode, response);
        }

        // PUT: api/Users/UpdateUser
        [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] User user)
        {
            if (user == null || user.Id <= 0)
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Invalid user data."
                });
            }

            var response = await _userRepository.UpdateUserAsync(user);
            return StatusCode(response.StatusCode, response);
        }

        // DELETE: api/Users/DeleteUser/{id}
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var response = await _userRepository.DeleteUserAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}