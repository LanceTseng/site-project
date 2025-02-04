using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Essentials;

namespace MobileProject.Helpers
{
    public class SecureStorageHelper
    {
        public static async Task SetUserSessionAsync(string isLoggedIn, string username, string role, string userId)
        {
            await SecureStorage.SetAsync("isLoggedIn", isLoggedIn);
            await SecureStorage.SetAsync("username", username);
            await SecureStorage.SetAsync("role", role);
            await SecureStorage.SetAsync("userId", userId);
        }

        public static async Task<string> GetIsLoggedInAsync()
        {
            return await SecureStorage.GetAsync("isLoggedIn");
        }

        public static async Task<string> GetUsernameAsync()
        {
            return await SecureStorage.GetAsync("username");
        }

        public static async Task<string> GetRoleAsync()
        {
            return await SecureStorage.GetAsync("role");
        }

        public static async Task<string> GetUserIdAsync()
        {
            return await SecureStorage.GetAsync("userId");
        }

        public static async Task ClearUserSessionAsync()
        {
            SecureStorage.Remove("isLoggedIn");
            SecureStorage.Remove("username");
            SecureStorage.Remove("role");
            SecureStorage.Remove("userId");
        }

        public static async Task ClearUserSessionAllAsync()
        {
            SecureStorage.RemoveAll();
        }
    }
}