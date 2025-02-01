using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace MobileProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsRepository _productsRepository;

        public ProductsController(IProductsRepository productsRepository)
        {
            _productsRepository = productsRepository;
        }

        [HttpGet("GetAllProdcut")]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _productsRepository.GetAllProductsAsync();

            if (!products.Any())
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "No products found."
                });
            }

            return Ok(products);
        }

        [HttpGet("GetProductsByCondition")]
        public async Task<IActionResult> GetUsersByCondition(string? name, decimal? minPrice, decimal? maxPrice,
            DateTime? dateFrom, DateTime? dateTo)
        {
            var products = await _productsRepository.GetProductsByConditionAsync(name, minPrice, maxPrice, dateFrom, dateTo);

            if (!products.Any())
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "No products found matching the criteria."
                });
            }

            return Ok(products);
        }


        // GET: api/Users/GetUserById/{id}
        [HttpGet("GetProductById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var product = await _productsRepository.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new Response
                {
                    StatusCode = StatusCodes.Status404NotFound,
                    StatusMessage = "Product not found."
                });
            }

            return Ok(product);
        }

        // POST: api/Users/CreateUser
        [HttpPost("CreateProduct")]
        public async Task<IActionResult> CreateUser([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Invalid user data."
                });
            }

            var response = await _productsRepository.CreateProductAsync(product);
            return StatusCode(response.StatusCode, response);
        }

        // PUT: api/Users/UpdateUser
        [HttpPut("UpdateProduct")]
        public async Task<IActionResult> UpdateUser([FromBody] Product product)
        {
            if (product == null || product.Id <= 0)
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Invalid product data."
                });
            }

            var response = await _productsRepository.UpdateProductAsync(product);
            return StatusCode(response.StatusCode, response);
        }

        // DELETE: api/Users/DeleteUser/{id}
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var response = await _productsRepository.DeleteProductAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}
