using MobileProject.API.Models;

namespace MobileProject.API.Repositories.Interfaces;

public interface IUsersRepository
{
    Task<IEnumerable<User>> GetAllUsersAsync();

    Task<User?> GetUserByIdAsync(int id);

    Task<IEnumerable<User>> GetUsersByConditionAsync(string? userName, string? password, string? email, string? phone, string? role);

    Task<Response> CreateUserAsync(User user);

    Task<Response> UpdateUserAsync(User user);

    Task<Response> DeleteUserAsync(int id);
}