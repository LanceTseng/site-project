using System.Data;

namespace Barbershop.Models;

public class Role
{
    public int RoleId { get; set; }
    public string RoleName { get; set; }
    public ICollection<UserRole> UserRoles { get; set; }
}