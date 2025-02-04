using System.Collections.Generic;
using System.Threading.Tasks;
using MobileProject.Model;

namespace MobileProject.Service.Interface
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<IEnumerable<User>> GetUsersByConditionAsync(string userName = null, string password = null, string email = null, string phone = null, string role = null);
        Task<User> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(User user);
        Task<User> UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(int id);
    }
}