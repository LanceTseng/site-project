using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using MobileProject.Model;
using MobileProject.Service.Interface;

namespace MobileProject.Service
{
    public class UserService : IUserService
    {
        private const string BaseUrl = "api/Users";
        private readonly ApiService _apiService;

        public UserService()
        {
            _apiService = new ApiService();
        }

        // Get all users
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _apiService.CallApiAsync<IEnumerable<User>>($"{BaseUrl}/GetAllUsers", HttpMethod.Get);
        }

        // Get users by condition
        public async Task<IEnumerable<User>> GetUsersByConditionAsync(string userName = null, string password = null, string email = null, string phone = null, string role = null)
        {
            var queryString = $"?userName={userName}&password={password}&email={email}&phone={phone}&role={role}";
            return await _apiService.CallApiAsync<IEnumerable<User>>($"{BaseUrl}/GetUsersByCondition{queryString}", HttpMethod.Get);
        }

        // Get user by ID
        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _apiService.CallApiAsync<User>($"{BaseUrl}/GetUserById/{id}", HttpMethod.Get);
        }

        // Create new user
        public async Task<User> CreateUserAsync(User user)
        {
            return await _apiService.CallApiAsync<User>($"{BaseUrl}/CreateUser", HttpMethod.Post, user);
        }

        // Update existing user
        public async Task<User> UpdateUserAsync(User user)
        {
            return await _apiService.CallApiAsync<User>($"{BaseUrl}/UpdateUser", HttpMethod.Put, user);
        }

        // Delete user by ID
        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _apiService.CallApiAsync<bool>($"{BaseUrl}/DeleteUser/{id}", HttpMethod.Delete);
        }
    }
}