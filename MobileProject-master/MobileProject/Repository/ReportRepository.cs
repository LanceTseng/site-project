using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using MobileProject.Model;
using SQLite;
using Xamarin.Forms;

namespace MobileProject.Repository
{
    public class ReportRepository
    {
        private SQLiteConnection database;
        private static object collisionLock = new object();

        //public IEnumerable<Customer> GetFilteredCustomers()
        //{
        //    lock (collisionLock)
        //    {
        //        return database.Query<Customer>(
        //            "SELECT * FROM Item WHERE Country = 'Italy'").AsEnumerable();
        //    }
        //}

        public ReportRepository()
        {
            database =
                DependencyService.Get<IDatabaseConnection>().DbConnection();
        }

        public IEnumerable<Overview> GetOverviewReports()
        {
            if (database == null)
            {
                throw new InvalidOperationException("Database connection is not initialized.");
            }

            lock (collisionLock)
            {
                try
                {
                    var query = @"
                SELECT
                    u.Id AS UserId,
                    u.UserName,
                    u.Role,
                    u.Phone,
                    u.Email,
                    o.Id AS OrderId,
                    o.TransactionCode,
                    o.Subtotal,
                    o.Date AS OrderDate,
                    o.Status AS OrderStatus,
                    p.Id AS ProductId,
                    p.Name AS ProductName,
                    p.Price AS ProductPrice,
                    cr.Qty AS Quantity,
                    cr.Total AS TotalPrice,
                    p.Image AS ProductImage
                FROM cart_record cr
                LEFT JOIN product p ON cr.ProductId = p.Id
                LEFT JOIN [order] o ON cr.TransactionCode = o.TransactionCode
                LEFT JOIN [user] u ON o.UserId = u.Id";
                    
                    var results = database.Query<Overview>(query);

                    if (results == null || !results.Any())
                    {
                        Console.WriteLine("Query returned no results.");
                    }

                    //var dt = InsertDataToDatatable<Overview>(results);

                    return results;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                    throw;
                }
            }
        }

        public DataTable CreateDataTable<T>()
        {
            var result = new DataTable();
            var dataType = typeof(T);

            foreach (var prop in dataType.GetProperties())
            {
                result.Columns.Add(prop.Name, typeof(string));
            }

            return result;
        }

        public DataTable InsertDataToDatatable<T>(List<T> results)
        {
            // Get properties of the T type
            var properties = typeof(T).GetProperties();

            var dt = new DataTable();
            // Add columns to the datatable based on properties
            foreach (var prop in properties)
            {
                dt.Columns.Add(prop.Name, prop.PropertyType);
            }

            // Loop through each object in results
            foreach (var result in results)
            {
                var tempRow = dt.NewRow();
                var columnIndex = 0;

                // Loop through properties and get values from each object
                foreach (var prop in properties)
                {
                    var value = prop.GetValue(result);

                    // Handle empty strings based on data type
                    if (value is string && string.IsNullOrEmpty((string)value))
                    {
                        if (prop.PropertyType == typeof(int))
                        {
                            value = null;
                        }
                        else if (prop.PropertyType == typeof(decimal))
                        {
                            value = null;
                        }
                        else if (prop.PropertyType == typeof(DateTime))
                        {
                            value = null;
                        }
                    }

                    tempRow[columnIndex] = value;
                    columnIndex++;
                }

                dt.Rows.Add(tempRow);
            }

            return dt;
        }
    }
}