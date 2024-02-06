using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment1.Entities
{
    public class Option
    {
        public decimal OptionId { get; set; }
        public decimal QuestionId { get; set; }
        public string OptionContext { get; set; }
        public decimal Sequence { get; set; }

    }
}
