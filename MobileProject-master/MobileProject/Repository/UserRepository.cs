using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MobileProject.Model;
using SQLite;
using Xamarin.Forms;

namespace MobileProject.Repository
{
    public class UserRepository
    {
        private SQLiteConnection database;
        private static object collisionLock = new object();
        public ObservableCollection<User> Users { get; set; }

        public UserRepository()
        {
            database =
                DependencyService.Get<IDatabaseConnection>().
                    DbConnection();
            database.CreateTable<User>();
            this.Users =
                new ObservableCollection<User>(database.Table<User>());
            if (!database.Table<User>().Any())
            {
                AddDefaultUser();
            }
        }

        private void AddDefaultUser()
        {
            database.Insert(new User()
            {
                UserName = "admin",
                Password = "pwd",
                Email = "admin@gmail.com",
                CreatedDate = DateTime.Now,
                Phone = "1231231234",
                Role = "admin"
            });

            database.Insert(new User()
            {
                UserName = "customer",
                Password = "pwd",
                Email = "customer@gmail.com",
                Phone = "4564564567",
                CreatedDate = DateTime.Now,
                Role = "user"
            });
        }

        public async Task InsertAsync(User user)
        {
            lock (collisionLock)
            {
                database.Insert(user);
            }
        }

        public async Task UpdateAsync(User user)
        {
            lock (collisionLock)
            {
                database.Update(user);
            }
        }

        public async Task DeleteAsync(int id)
        {
            lock (collisionLock)
            {
                database.Delete<User>(id);
            }
        }

        //Insert
        public int InsertUser(User user)
        {
            lock (collisionLock)
            {
                return database.Insert(user);
            }
        }

        //Update
        public int UpdateUser(User user)
        {
            lock (collisionLock)
            {
                return database.Update(user);
            }
        }

        //Delete
        public int DeleteUser(int id)
        {
            lock (collisionLock)
            {
                return database.Delete<User>(id);
            }
        }

        //Delete All
        public int DeleteUserAll()
        {
            lock (collisionLock)
            {
                return database.DeleteAll<User>();
            }
        }

        //Query
        public IEnumerable<User> GetFilterUser(string userName = null, string password = null)
        {
            // Use locks to avoid database collitions
            lock (collisionLock)
            {
                var query = database.Table<User>()
                    .Where(x =>
                        (userName == null || x.UserName == userName) &&
                        (password == null || x.Password == password))
                    .ToList();

                return query.AsEnumerable();
            }
        }

        public IEnumerable<User> GetFilterUserQuery(string userName = null, int userId = -1,string phone = null, string email = null, string role = null)
        {
            // Use locks to avoid database collitions
            lock (collisionLock)
            {
                var query = database.Table<User>()
                    .Where(x =>
                        (userName == null || x.UserName.ToLower().Contains(userName.ToLower())) &&
                        (phone == null || x.Phone.ToLower().Contains(phone.ToLower())) &&
                        (email == null || x.Email.ToLower().Contains(email.ToLower())) &&
                        (role == null || x.Role.ToLower().Contains(role.ToLower())) &&
                        (userId == -1 || x.Id == userId)
                        )
                    .ToList();

                return query.AsEnumerable();
            }
        }

        //Get Count
        public int GetCount()
        {
            lock (collisionLock)
            {
                return (from i in database.Table<User>() select i).ToList().Count();
            }
        }
    }
}