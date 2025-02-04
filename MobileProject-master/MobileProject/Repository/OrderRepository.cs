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
    public class OrderRepository
    {
        private SQLiteConnection database;
        private static object collisionLock = new object();
        public ObservableCollection<Order> Orders { get; set; }

        public OrderRepository()
        {
            database =
                DependencyService.Get<IDatabaseConnection>().
                    DbConnection();
            database.CreateTable<Order>();
            this.Orders =
                new ObservableCollection<Order>(database.Table<Order>());
        }

        public async Task InsertAsync(Order order)
        {
            lock (collisionLock)
            {
                database.Insert(order);
            }
        }

        public async Task UpdateAsync(Order order)
        {
            lock (collisionLock)
            {
                database.Update(order);
            }
        }

        public async Task DeleteAsync(int id)
        {
            lock (collisionLock)
            {
                database.Delete<Order>(id);
            }
        }

        //Insert
        public int InsertOrder(Order order)
        {
            lock (collisionLock)
            {
                return database.Insert(order);
            }
        }

        //Update
        public int UpdateOrder(Order order)
        {
            lock (collisionLock)
            {
                return database.Update(order);
            }
        }

        //Delete
        public int DeleteOrder(int id)
        {
            lock (collisionLock)
            {
                return database.Delete<Order>(id);
            }
        }

        //Delete All
        public int DeleteOrderAll()
        {
            lock (collisionLock)
            {
                return database.DeleteAll<Order>();
            }
        }

        //Query
        public IEnumerable<Order> GetFilteredOrder(string transactionCode = null, DateTime? dateFrom = null, DateTime? dateTo = null, IEnumerable<User> users = null)
        {
            // Use locks to avoid database collitions
            lock (collisionLock)
            {
                var userIds = users?.Select(user => user.Id).ToList();

                // Query the database
                var query = database.Table<Order>().AsQueryable();

                if (!string.IsNullOrEmpty(transactionCode))
                {
                    // Perform case-insensitive comparison
                    query = query.Where(x => x.TransactionCode.ToLower().Contains(transactionCode.ToLower()));
                }

                if (userIds != null && userIds.Any())
                {
                    // Use LINQ-to-Objects for user ID filtering (after retrieving data from DB)
                    query = query.ToList().Where(x => userIds.Contains(x.UserId)).AsQueryable();
                }

                if (dateFrom.HasValue)
                {
                    query = query.Where(x => x.Date.Date >= dateFrom.Value.Date);
                }

                if (dateTo.HasValue)
                {
                    query = query.Where(x => x.Date.Date <= dateTo.Value.Date);
                }

                return query.AsEnumerable();
            }
        }

        public IEnumerable<Order> GetFilteredOrders(IEnumerable<string> transactionCodes = null, string transactionCode = null, DateTime? dateFrom = null, DateTime? dateTo = null)
        {
            // Use locks to avoid database collisions
            lock (collisionLock)
            {
                var query = database.Table<Order>().AsQueryable();

                // Filter by transaction codes if provided
                if (transactionCodes != null && transactionCodes.Any())
                {
                    query = query.Where(x => transactionCodes.Contains(x.TransactionCode));
                }

                query = query.Where(x =>
                    (transactionCode == null || x.TransactionCode.ToLower().Contains(transactionCode.ToLower())) &&
                    (dateFrom == null || x.Date.Date >= dateFrom.Value.Date) &&
                    (dateTo == null || x.Date.Date <= dateTo.Value.Date));

                return query.ToList();
            }
        }

        //Get Count
        public int GetCount()
        {
            lock (collisionLock)
            {
                return (from i in database.Table<Order>() select i).ToList().Count();
            }
        }
    }
}