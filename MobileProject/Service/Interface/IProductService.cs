using System.Collections.Generic;
using System.Threading.Tasks;
using MobileProject.Model;

namespace MobileProject.Service.Interface
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<IEnumerable<Product>> GetProductsByConditionAsync(string productName = null, double maxPrice = 9999, decimal minPrice = 0);
        Task<Product> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(int id);
    }
}