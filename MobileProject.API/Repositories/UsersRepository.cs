using Dapper;
using Microsoft.Data.SqlClient;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using System.Data;
using StatusCodes = MobileProject.API.Models.StatusCodes;

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
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<User>("SELECT * FROM Users");
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Id = @Id", new { Id = id });
        }

        public async Task<IEnumerable<User>> GetUsersByConditionAsync(string? role, DateTime? dateFrom, DateTime? dateTo, string? userName)
        {
            using var connection = new SqlConnection(_connectionString);

            var query = "SELECT * FROM Users WHERE " +
                        "(@Role IS NULL OR Role = @Role) " +
                        "AND (@DateFrom IS NULL OR CreatedDate >= @DateFrom) " +
                        "AND (@DateTo IS NULL OR CreatedDate <= @DateTo) " +
                        "AND (@UserName IS NULL OR UserName LIKE '%' + @UserName + '%')";

            // Create parameters explicitly using SqlParameter
            var parameters = new DynamicParameters();
            parameters.Add("@Role", role, DbType.String);
            parameters.Add("@DateFrom", dateFrom, DbType.DateTime);
            parameters.Add("@DateTo", dateTo, DbType.DateTime);
            parameters.Add("@UserName", userName, DbType.String);

            return await connection.QueryAsync<User>(query, parameters);
        }

        public async Task<Response> CreateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("@UserName", user.UserName, DbType.String);
            parameters.Add("@Role", user.Role, DbType.String);
            parameters.Add("@CreatedDate", user.CreatedDate, DbType.DateTime);

            var result = await connection.ExecuteAsync(
                "INSERT INTO Users (UserName, Role, CreatedDate) VALUES (@UserName, @Role, @CreatedDate)", parameters);

            return new Response
            {
                StatusCode = result > 0 ? StatusCodes.Success : StatusCodes.ServerError,
                StatusMessage = result > 0 ? "User created successfully" : "Failed to create user"
            };
        }

        public async Task<Response> UpdateUserAsync(User user)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("@UserName", user.UserName, DbType.String);
            parameters.Add("@Role", user.Role, DbType.String);
            parameters.Add("@Id", user.Id, DbType.Int32);

            var result = await connection.ExecuteAsync(
                "UPDATE Users SET UserName = @UserName, Role = @Role WHERE Id = @Id", parameters);

            return new Response
            {
                StatusCode = result > 0 ? StatusCodes.Success : StatusCodes.ServerError,
                StatusMessage = result > 0 ? "User updated successfully" : "Failed to update user"
            };
        }

        public async Task<Response> DeleteUserAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id, DbType.Int32);

            var result = await connection.ExecuteAsync("DELETE FROM Users WHERE Id = @Id", parameters);

            return new Response
            {
                StatusCode = result > 0 ? StatusCodes.Success : StatusCodes.ServerError,
                StatusMessage = result > 0 ? "User deleted successfully" : "Failed to delete user"
            };
        }
    }
}