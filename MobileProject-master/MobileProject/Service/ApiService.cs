using Newtonsoft.Json;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System;

namespace MobileProject.Service
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "http://10.0.2.2:5180"; // Base URL for the API

        public ApiService()
        {
            _httpClient = new HttpClient();
        }

        // Generic method to call API with different HTTP methods
        public async Task<T> CallApiAsync<T>(string endpoint, HttpMethod method, object body = null)
        {
            var uri = $"{BaseUrl}/{endpoint}";
            var requestMessage = new HttpRequestMessage(method, uri);

            // If body is not null, serialize it and add it to the request content
            if (body != null && method != HttpMethod.Get)
            {
                // Ensure the body is serialized correctly
                var jsonContent = JsonConvert.SerializeObject(body);
                requestMessage.Content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            }

            try
            {
                // Make the HTTP request
                var response = await _httpClient.SendAsync(requestMessage);

                // Ensure successful status code
                response.EnsureSuccessStatusCode();

                // Read and deserialize the response content
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<T>(content);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error calling API: {ex.Message}");
                return default(T); // Return default if an error occurs
            }
        }
    }
}