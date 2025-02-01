using MobileProject.API.Models;

namespace MobileProject.API.Repositories.Interfaces;

public interface IProductsRepository
{
    Task<IEnumerable<Product>> GetAllProductsAsync();

    Task<Product?> GetProductByIdAsync(int id);

    Task<IEnumerable<Product>> GetProductsByConditionAsync(string? name, decimal? minPrice, decimal? maxPrice,
        DateTime? dateFrom, DateTime? dateTo);
    Task<Response> CreateProductAsync(Product product);

    Task<Response> UpdateProductAsync(Product product);

    Task<Response> DeleteProductAsync(int id);
}