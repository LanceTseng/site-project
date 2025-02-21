using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MobileProject.API.Models;
using MobileProject.API.Repositories.Interfaces;
using StatusCodes = Microsoft.AspNetCore.Http.StatusCodes;

namespace MobileProject.API.Controllers.api
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

        [HttpGet("GetAllProducts")]
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
        public async Task<IActionResult> GetProductsByCondition([FromQuery] string? productName, [FromQuery] decimal? minPrice, [FromQuery] decimal? maxPrice,
            DateTime? dateFrom, DateTime? dateTo)
        {
            var products = await _productsRepository.GetProductsByConditionAsync(productName, minPrice, maxPrice);

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

        // GET: api/Products/GetProductById/{id}
        [HttpGet("GetProductById/{id}")]
        public async Task<IActionResult> GetProductById(int id)
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

        // POST: api/Products/CreateProduct
        [HttpPost("CreateProduct")]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (product == null)
            {
                return BadRequest(new Response
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    StatusMessage = "Invalid product data."
                });
            }

            var response = await _productsRepository.CreateProductAsync(product);
            return StatusCode(response.StatusCode, response);
        }

        // PUT: api/Products/UpdateProduct
        [HttpPut("UpdateProduct")]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product)
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

        // DELETE: api/Products/DeleteProduct/{id}
        [HttpDelete("DeleteProduct/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var response = await _productsRepository.DeleteProductAsync(id);
            return StatusCode(response.StatusCode, response);
        }
    }
}