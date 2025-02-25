using System;
using System.Collections.ObjectModel;

namespace MobileProject.Model
{
    public class User : BaseModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Role { get; set; }

        public User()
        {
        }
    }
}