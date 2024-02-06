using System;
using System.Collections.Generic;
using System.IO;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace Application1_WinForm
{
    public class NpoiReader
    {
        /// <summary>
        /// Read Excel
        /// </summary>
        /// <typeparam name="T">dynamic object</typeparam>
        /// <param name="filePath"></param>
        /// <param name="sheetIndex"></param>
        /// <returns></returns>
        public List<T> ReadExcelFile<T>(string filePath, int sheetIndex = 0)
        {
            var result = new List<T>();

            using (FileStream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
            {
                IWorkbook workbook = new XSSFWorkbook(fileStream); // Use XSSFWorkbook for Excel 2007 and later

                ISheet sheet = workbook.GetSheetAt(sheetIndex); // Assuming you want to read from the first sheet

                // Iterate through rows
                for (int rowIndex = 1;
                     rowIndex <= sheet.LastRowNum;
                     rowIndex++) // Assuming data starts from the second row
                {
                    IRow row = sheet.GetRow(rowIndex);

                    if (row == null)
                        continue;

                    var tempObject = (T)Activator.CreateInstance(typeof(T));
                    var columnIndex = 0;

                    foreach (var prop in tempObject.GetType().GetProperties())
                    {
                        var valueString = row.GetCell(columnIndex++).ToString();
                        var dataTypeString = prop.PropertyType.ToString().ToLower();

                        if (dataTypeString.Contains("int"))
                        {
                            prop.SetValue(tempObject, valueString == "" ? new int?() : Convert.ToInt32(valueString),
                                null);
                        }
                        else if (dataTypeString.Contains("decimal"))
                        {
                            prop.SetValue(tempObject,
                                valueString == "" ? new decimal?() : Convert.ToDecimal(valueString), null);
                        }
                        else if (dataTypeString.Contains("datetime"))
                        {
                            prop.SetValue(tempObject,
                                valueString == "" ? new DateTime?() : Convert.ToDateTime(valueString), null);
                        }
                        else
                        {
                            prop.SetValue(tempObject, valueString, null);
                        }
                    }

                    result.Add(tempObject);
                }
            }

            return result;
        }
    }
}