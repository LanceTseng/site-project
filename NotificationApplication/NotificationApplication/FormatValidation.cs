using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace NotificationApplication
{
    internal class FormatValidation
    {
        public bool ValidateEmail(string input)
        {
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(input, pattern);
        }

        public bool ValidateSMS(string input)
        {
            string pattern = @"^\d{3}-\d{3}-\d{4}$";
            return Regex.IsMatch(input, pattern);
        }
    }
}