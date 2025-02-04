using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace MobileProject.API.Repositories;

public class ProductsRepository : IProductsRepository
{
    private readonly string _connectionString;
     
    public ProductsRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryAsync<Product>("SELECT * FROM Products");
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        return await connection.QueryFirstOrDefaultAsync<Product>(
            "SELECT * FROM Products WHERE Id = @Id", new { Id = id });
    }

    public async Task<IEnumerable<Product>> GetProductsByConditionAsync(string? productName, decimal? minPrice, decimal? maxPrice)
    {
        using var connection = new SqlConnection(_connectionString);

        var query = "SELECT * FROM Products WHERE 1=1" +
                    "AND (@Name IS NULL OR Name LIKE '%' + @Name + '%') " +
                    "AND (@MinPrice IS NULL OR Price >= @MinPrice) " +
                    "AND (@MaxPrice IS NULL OR Price <= @MaxPrice) " ;

        // Create parameters explicitly using SqlParameter
        var parameters = new DynamicParameters();
        parameters.Add("@Name", productName, DbType.String);
        parameters.Add("@MinPrice", minPrice, DbType.Decimal);
        parameters.Add("@MaxPrice", maxPrice, DbType.Decimal);

        return await connection.QueryAsync<Product>(query, parameters);
    }

    public async Task<Response> CreateProductAsync(Product product)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        parameters.Add("@Name", product.Name, DbType.String);
        parameters.Add("@Description", product.Description, DbType.String);
        parameters.Add("@Price", product.Price, DbType.Decimal);
        parameters.Add("@Date", product.Date, DbType.DateTime);
        parameters.Add("@Image", product.Image, DbType.String);

        var result = await connection.ExecuteAsync(
            "INSERT INTO Products (Name, Description, Price, Date, Image) VALUES (@Name, @Description, @Price, @Date, @Image)", parameters);

        return new Response
        {
            StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
            StatusMessage = result > 0 ? "Product created successfully" : "Failed to create product"
        };
    }

    public async Task<Response> UpdateProductAsync(Product product)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        parameters.Add("@Name", product.Name, DbType.String);
        parameters.Add("@Description", product.Description, DbType.String);
        parameters.Add("@Price", product.Price, DbType.Decimal);
        parameters.Add("@Date", product.Date, DbType.DateTime);
        parameters.Add("@Image", product.Image, DbType.String);
        parameters.Add("@Id", product.Id, DbType.Int32);

        var result = await connection.ExecuteAsync(
            "UPDATE Products SET Name = @Name, Description = @Description, Price = @Price, Date = @Date, Image = @Image WHERE Id = @Id", parameters);

        return new Response
        {
                StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
                StatusMessage = result > 0 ? "Product updated successfully" : "Failed to update product"
        };
    }

    public async Task<Response> DeleteProductAsync(int id)
    {
        using var connection = new SqlConnection(_connectionString);
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id, DbType.Int32);

        var result = await connection.ExecuteAsync("DELETE FROM Products WHERE Id = @Id", parameters);

        return new Response
        {
            StatusCode = result > 0 ? StatusCodes.Status200OK : StatusCodes.Status500InternalServerError,
            StatusMessage = result > 0 ? "Product deleted successfully" : "Failed to delete product"
        };
    }
}