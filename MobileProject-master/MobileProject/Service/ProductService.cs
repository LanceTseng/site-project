using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using MobileProject.Model;
using MobileProject.Service.Interface;

namespace MobileProject.Service
{
    public class ProductService : IProductService
    {
        private const string BaseUrl = "api/Products";
        private readonly ApiService _apiService;

        public ProductService(ApiService apiService)
        {
            _apiService = apiService;
        }

        // Get all products
        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _apiService.CallApiAsync<IEnumerable<Product>>($"{BaseUrl}/GetAllProducts", HttpMethod.Get);
        }

        public async Task<IEnumerable<Product>> GetProductsByConditionAsync(string productName = null, double maxPrice = 9999, decimal minPrice = 0)
        {
            // Construct the query string for GET request
            var query = $"?productName={productName}&maxPrice={maxPrice}&minPrice={minPrice}";

            // Make GET request with query parameters
            return await _apiService.CallApiAsync<IEnumerable<Product>>($"{BaseUrl}/GetProductsByCondition{query}", HttpMethod.Get);
        }

        // Get a product by its ID
        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _apiService.CallApiAsync<Product>($"{BaseUrl}/GetProductById/{id}", HttpMethod.Get);
        }

        // Create a new product
        public async Task<Product> CreateProductAsync(Product product)
        {
            return await _apiService.CallApiAsync<Product>($"{BaseUrl}/CreateProduct", HttpMethod.Post, product);
        }

        // Update an existing product
        public async Task<Product> UpdateProductAsync(Product product)
        {
            return await _apiService.CallApiAsync<Product>($"{BaseUrl}/UpdateProduct", HttpMethod.Put, product);
        }

        // Delete a product by its ID
        public async Task<bool> DeleteProductAsync(int id)
        {
            var result = await _apiService.CallApiAsync<bool>($"{BaseUrl}/DeleteProduct/{id}", HttpMethod.Delete);
            return result;
        }
    }
}