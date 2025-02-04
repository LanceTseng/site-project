using System;
using System.Collections.ObjectModel;
using SQLite;

namespace MobileProject.Model
{
    [Table("user")]
    public class User : BaseModel
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        [Unique]
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