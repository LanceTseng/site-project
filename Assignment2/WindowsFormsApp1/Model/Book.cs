using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFormsApp1.Model
{
    public class Book
    {
        private string _code;
        private string _title;
        private string _author;
        private string _isbn;
        private string _category;
        private bool _available;

        public string Code
        {
            get { return _code; }
            set { _code = value; }
        }

        public string Title
        {
            get { return _title; }
            set { _title = value; }
        }

        public string Author
        {
            get { return _author; }
            set { _author = value; }
        }

        public string ISBN
        {
            get { return _isbn; }
            set { _isbn = value; }
        }
        public string Category
        {
            get { return _category; }
            set { _category = value; }
        }

        public bool Available
        {
            get { return _available; }
            set { _available = value; }
        }

        public Book(string code, string title, string author, string isbn, string category, bool available)
        {
            this._code = code;
            this._title = title;
            this._author = author;
            this._isbn = isbn;
            this._category = category;
            this._available = available;
        }

        public Book()
        {

        }
    }
}
