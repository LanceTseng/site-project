using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment1.Attributes
{
    public class ColumnAttr: Attribute
    {
        public string HeaderText { get; set; }
        public bool IsHidden { get; set; }
        public string Name { get; set; }
    }
}
