using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;

namespace WindowsFormsApp1.Model
{
    public class Library : Catalog
    {
        private string fileName = "inventory.xlsx";

        private List<Book> bookInventory = new List<Book>();

        public Library() : base()
        {
            LoadBookList();
        }

        /// <summary>
        /// Load the data from xlsx
        /// </summary>
        public void LoadBookList()
        {
            var file = new NpoiReader();
            var filePath = Path.Combine(fileName);
            setBookList(file.ReadExcelFile<Book>(filePath));
        }


        /// <summary>
        /// override the function from inherit class
        /// </summary>
        /// <returns></returns>
        public override List<string> GetCategoryType()
        {
            var categories = base.GetCategoryType();
            categories.Sort();
            return categories;
        }

        public List<Book> getBookList()
        {
            return bookInventory;
        }

        public void setBookList(List<Book> bookList)
        {
            bookInventory = bookList;
        }

        public void AddBook(Book book)
        {
            bookInventory.Add(book);
        }

        public void RemoveBook(Book book)
        {
            bookInventory.RemoveAll(x => x.Code == book.Code);
        }

        /// <summary>
        /// search by the different condition
        /// </summary>
        /// <param name="code"></param>
        /// <param name="title"></param>
        /// <param name="authur"></param>
        /// <param name="isbn"></param>
        /// <param name="category"></param>
        /// <returns></returns>
        public List<Book> SearchByCondition(string code = "", string title = "", string authur = "", string isbn = "",
            string category = "")
        {
            var resultList = bookInventory.AsQueryable();

            if (!string.IsNullOrEmpty(code))
                resultList = resultList.Where(x => x.Code.ToLower().Contains(code.ToLower()));
            if (!string.IsNullOrEmpty(title))
                resultList = resultList.Where(x => x.Title.ToLower().Contains(title.ToLower()));
            if (!string.IsNullOrEmpty(authur))
                resultList = resultList.Where(x => x.Author.ToLower().Contains(authur.ToLower()));
            if (!string.IsNullOrEmpty(isbn))
                resultList = resultList.Where(x => x.ISBN.ToLower().Contains(isbn.ToLower()));
            if (!string.IsNullOrEmpty(category))
                resultList = resultList.Where(x => x.Category.Contains(category));

            return resultList.ToList();
        }

        /// <summary>
        /// create dataset for displaying
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public DataTable DisplayData(List<Book> list)
        {
            var dt = new PublicFunction().CreateDataTable<Book>();

            foreach (var book in list)
            {
                dt.Rows.Add(new object[]
                {
                    book.Code,
                    book.Title,
                    book.Author,
                    book.ISBN,
                    book.Category,
                    book.Available
                });
            }

            return dt;
        }
    }
}