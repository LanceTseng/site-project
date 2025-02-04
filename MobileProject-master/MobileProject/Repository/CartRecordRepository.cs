using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using MobileProject.Model;
using SQLite;
using Xamarin.Forms;

namespace MobileProject.Repository
{
    public class CartRecordRepository
    {
        private SQLiteConnection database;
        private static object collisionLock = new object();
        public ObservableCollection<CartRecord> CartRecords { get; set; }

        public CartRecordRepository()
        {
            database =
                DependencyService.Get<IDatabaseConnection>().DbConnection();
            database.CreateTable<CartRecord>();
            this.CartRecords =
                new ObservableCollection<CartRecord>(database.Table<CartRecord>());
        }

        public async Task InsertAsync(CartRecord cart)
        {
            lock (collisionLock)
            {
                database.Insert(cart);
            }
        }

        public async Task UpdateAsync(CartRecord cart)
        {
            lock (collisionLock)
            {
                database.Update(cart);
            }
        }

        public async Task DeleteAsync(int id)
        {
            lock (collisionLock)
            {
                database.Delete<CartRecord>(id);
            }
        }

        //Insert
        public int InsertCart(CartRecord cart)
        {
            lock (collisionLock)
            {
                return database.Insert(cart);
            }
        }

        //Update
        public int UpdateCart(CartRecord cart)
        {
            lock (collisionLock)
            {
                return database.Update(cart);
            }
        }

        //Delete
        public int DeleteCart(int id)
        {
            lock (collisionLock)
            {
                return database.Delete<CartRecord>(id);
            }
        }

        //Delete All
        public int DeleteCartAll()
        {
            lock (collisionLock)
            {
                return database.DeleteAll<CartRecord>();
            }
        }

        public IEnumerable<CartRecord> GetFilteredCartRecord(string status = null, int? userId = -1,
            int? productId = null, string transactionCode = null)
        {
            // Use locks to avoid database collitions
            lock (collisionLock)
            {
                var query = database.Table<CartRecord>()
                    .Where(x =>
                        (status == null || x.Status == status) &&
                        (userId == -1 || x.UserId == userId) &&
                        (productId == null || x.ProductId == productId) &&
                        (transactionCode == null || x.TransactionCode == transactionCode))
                    .ToList();

                return query.AsEnumerable();
            }
        }

        //Get all
        public IEnumerable<CartRecord> GetAllCart()
        {
            lock (collisionLock)
            {
                return (from i in database.Table<CartRecord>() select i).ToList();
            }
        }

        //Get Count
        public int GetCount()
        {
            lock (collisionLock)
            {
                return (from i in database.Table<CartRecord>() select i).ToList().Count();
            }
        }

        //View
        //public IEnumerable<CartRecord> GetCartRecordsWithDetails()
        //{
        //    var query = from cart in database.Table<CartRecord>()
        //        join product in database.Table<Product>() on cart.ProductId equals product.Id
        //        join user in database.Table<User>() on cart.UserId equals user.Id
        //        join order in database.Table<Order>() on cart.TransactionCode equals order.TransactionCode
        //        select new CartRecord
        //        {
        //            Id = cart.Id,
        //            Name = cart.Name,
        //            Price = cart.Price,
        //            Qty = cart.Qty,
        //            Total = cart.Total,
        //            Image = cart.Image,
        //            ProductId = cart.ProductId,
        //            UserId = cart.UserId,
        //            Status = cart.Status,
        //            TransactionCode = cart.TransactionCode,

        //        };

        //    return query.ToList();
        //}

        //Dispose
        public void Dispose()
        {
            database.Dispose();
        }
    }

}