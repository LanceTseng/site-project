using System;

namespace Assignment1.Attributes
{
    public class ColumnAttr: Attribute
    {
        public string HeaderText { get; set; }
        public bool IsHidden { get; set; }
    }
}
