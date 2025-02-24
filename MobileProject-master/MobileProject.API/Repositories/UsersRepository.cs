using System.Data;
using System.Diagnostics;
using Dapper;
using Microsoft.Data.SqlClient;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace MobileProject.API.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly string _connectionString;

        public UsersRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            await using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<User>("SELECT * FROM Users");
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            await using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Id = @Id", new { Id = id });
        }

        public async Task<IEnumerable<User>> GetUsersByConditionAsync(string? userName, string? password, string? email, string? phone, string? role)
        {
            await using var connection = new SqlConnection(_connectionString);

            var query = "SELECT * FROM Users WHERE 1=1" +
                        "AND (@Role IS NULL OR Role = @Role) " +
                        "AND (@UserName IS NULL OR UserName LIKE '%' + @UserName + '%') " +
                        "AND (@Email IS NULL OR Email LIKE '%' + @Email + '%') " +
                        "AND (@Phone IS NULL OR Phone LIKE '%' + @Phone + '%')";

            // Create parameters explicitly using DynamicParameters
            var parameters = new DynamicParameters();
            parameters.Add("@UserName", userName, DbType.String);
            parameters.Add("@Password", password, DbType.String);
            parameters.Add("@Email", email, DbType.String);
            parameters.Add("@Phone", phone, DbType.String);
            parameters.Add("@Role", role, DbType.String);

            return await connection.QueryAsync<User>(query, parameters);
        }

        public async Task<Response> CreateUserAsync(User user)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@UserName", user.UserName, DbType.String);
            parameters.Add("@Password", user.Password, DbType.String);
            parameters.Add("@Phone", user.Phone, DbType.String);
            parameters.Add("@Email", user.Email, DbType.String);
            parameters.Add("@Role", user.Role, DbType.String);
            parameters.Add("@CreatedDate", user.CreatedDate != DateTime.MinValue ? user.CreatedDate : DateTime.Now, DbType.DateTime);

            var result = await connection.ExecuteAsync(
                "INSERT INTO Users (UserName, Password, Phone, Email, Role, CreatedDate) " +
                "VALUES (@UserName, @Password, @Phone, @Email, @Role, @CreatedDate)", parameters);

            return new Response
            {
                StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
                StatusMessage = result > 0 ? "User created successfully" : "Failed to create user"
            };
        }

        public async Task<Response> UpdateUserAsync(User user)
        {
            await using var connection = new SqlConnection(_connectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@Id", user.Id, DbType.Int32);
            parameters.Add("@UserName", user.UserName, DbType.String);
            parameters.Add("@Password", user.Password, DbType.String);
            parameters.Add("@Phone", user.Phone, DbType.String);
            parameters.Add("@Email", user.Email, DbType.String);
            parameters.Add("@Role", user.Role, DbType.String);
            parameters.Add("@CreatedDate", user.CreatedDate, DbType.DateTime);

            var result = await connection.ExecuteAsync(
                "UPDATE Users SET UserName = @UserName, Password = @Password, Phone = @Phone, " +
                "Email = @Email, Role = @Role, CreatedDate = @CreatedDate WHERE Id = @Id", parameters);

            return new Response
            {
                StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
                StatusMessage = result > 0 ? "User updated successfully" : "Failed to update user"
            };
        }

        public async Task<Response> DeleteUserAsync(int id)
        {
            await using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id, DbType.Int32);

            var result = await connection.ExecuteAsync("DELETE FROM Users WHERE Id = @Id", parameters);

            return new Response
            {
                StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
                StatusMessage = result > 0 ? "User deleted successfully" : "Failed to delete user"
            };
        }
    }
}