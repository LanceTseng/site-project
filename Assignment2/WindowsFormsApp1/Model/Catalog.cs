using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsFormsApp1.Model
{
    public class Catalog
    {
        private List<string> _categories;

        public Catalog()
        {
            _categories = new List<string>
            {
                "Fiction",
                "Non-Fiction",
                "Mystery",
                "Thriller",
                "Romance",
                "Science Fiction",
                "Biography",
                "History",
                "SelfHelp",
                "Programming",
                "Business",
                "Psychology",
                "Spirituality",
                "Economics"
            };
        }

        public virtual List<string> GetCategoryType()
        {
            return _categories;
        }

    }
}
