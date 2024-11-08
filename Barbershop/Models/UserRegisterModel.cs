using System.ComponentModel.DataAnnotations;

namespace Barbershop.Models;

public class UserRegisterModel
{
    [Required]
    public string Username { get; set; }

    [Required]
    [DataType(DataType.Password)]
    public string Password { get; set; }

    [Required]
    [DataType(DataType.EmailAddress)]
    public string Email { get; set; }

    [Required]
    [Phone]
    public string Phone { get; set; }
}