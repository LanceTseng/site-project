using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment1.Entities
{
    public class Record
    {
        public int QuestionSequence { get; set; }
        public int Selection { get; set; }
        public string Correction { get; set; }
        
    }
}
