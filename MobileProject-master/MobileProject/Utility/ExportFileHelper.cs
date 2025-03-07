using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace MobileProject.Utility
{
    public static class ExportFileHelper
    {
        public static async Task<string> ExportToExcelAsync<T>(List<T> data)
        {
            if (data == null || data.Count == 0)
                return null;

            try
            {
                var workbook = new XLWorkbook();
                var worksheet = workbook.Worksheets.Add("Exported Data");

                // Get properties dynamically from the object
                var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

                // Add Headers (Column Names)
                for (int i = 0; i < properties.Length; i++)
                {
                    worksheet.Cell(1, i + 1).Value = properties[i].Name;
                }

                // Add Data Rows
                for (int rowIndex = 0; rowIndex < data.Count; rowIndex++)
                {
                    var item = data[rowIndex];

                    for (int colIndex = 0; colIndex < properties.Length; colIndex++)
                    {
                        var value = properties[colIndex].GetValue(item, null);
                        worksheet.Cell(rowIndex + 2, colIndex + 1).Value = value?.ToString();
                    }
                }

                // Adjust column width
                worksheet.Columns().AdjustToContents();

                // Generate file name
                var fileName = $"ExportedData_{DateTime.Now:yyyyMMddHHmmss}";

                // Save to temporary path
                var tempPath = Path.Combine(FileSystem.CacheDirectory, fileName);
                workbook.SaveAs(tempPath);

                // Read the file as byte array
                byte[] fileBytes = File.ReadAllBytes(tempPath);

                // Save file to external storage using DependencyService
                await DependencyService.Get<IFileService>().SaveExcelFileAsync(fileBytes, fileName);

                return fileName;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Excel export failed: {ex.Message}");
                return null;
            }   
        }
    }
}