using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Assignment1.Entities
{
    public class Question
    {
        public decimal QuestionId { get; set; }
        public string QuestionContext { get; set; }
        public decimal CorrectOptionId { get; set; }
    }
}
