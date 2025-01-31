using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MobileProject.Model;
using MobileProject.View.AdminView;
using SQLite;
using Xamarin.Forms;

namespace MobileProject.Repository
{
    public class ProductRepository
    {
        private SQLiteConnection database;
        private static object collisionLock = new object();
        public ObservableCollection<Product> Products { get; set; }

        public ProductRepository()
        {
            database =
              DependencyService.Get<IDatabaseConnection>().
              DbConnection();
            database.CreateTable<Product>();
            this.Products =
              new ObservableCollection<Product>(database.Table<Product>());
            // If the table is empty, initialize the collection
            if (!database.Table<Product>().Any())
            {
                foreach (var products in new DummyData.DummyData().Products)
                {
                    AddDefaultProduct(products);
                }
            }
        }


        public void AddDefaultProduct(Product productInstance)
        {
            database.Insert(productInstance);
        }


        public async Task InsertAsync(Product product)
        {
            lock (collisionLock)
            {
                database.Insert(product);
            }
        }

        public async Task UpdateAsync(Product product)
        {
            lock (collisionLock)
            {
                database.Update(product);
            }
        }

        public async Task DeleteAsync(int id)
        {
            lock (collisionLock)
            {
                database.Delete<Product>(id);
            }
        }

        public async Task<IEnumerable<Product>> GetFilteredProductsAsync(int productId = -1, string name = null)
        {
            return await Task.Run(() =>
            {
                var query = database.Table<Product>().Where(x =>
                    (productId == -1 || x.Id == productId) &&
                    (name == null || x.Name.ToLower().Contains(name.ToLower())));

                return query.AsEnumerable(); // Synchronous ToList()
            });
        }

        //Insert
        public int InsertUser(Product product)
        {
            lock (collisionLock)
            {
                return database.Insert(product);
            }
        }

        //Update
        public int UpdateUser(Product product)
        {
            lock (collisionLock)
            {
                return database.Update(product);
            }
        }

        //Delete
        public int DeleteProduct(int id)
        {
            lock (collisionLock)
            {
                return database.Delete<Product>(id);
            }
        }

        //Delete All
        public int DeleteProductAll()
        {
            lock (collisionLock)
            {
                return database.DeleteAll<Product>();
            }
        }

        public IEnumerable<Product> GetFilteredProducts(int productId = -1 ,string name = null)
        {
            // Use locks to avoid database collitions
            lock (collisionLock)
            {
                var query = database.Table<Product>().Where(x =>
                    (productId == -1 || x.Id == productId) &&
                    (name == null || x.Name.ToLower().Contains(name.ToLower())));
                          
                return query.AsEnumerable();
            }
        }

        public IEnumerable<Product> GetFilteredProducts()
        {
            lock (collisionLock)
            {
                var query = database.Table<Product>().ToList();
               
                return query.AsEnumerable();
            }
        }

        public IEnumerable<Product> GetProductList()
        {
            lock (collisionLock)
            {
                return (from i in database.Table<Product>() select i).ToList();
            }
        }


        public int GetCount()
        {
            lock (collisionLock)
            {
                return (from i in database.Table<Product>() select i).ToList().Count();
            }
        }
    }
}