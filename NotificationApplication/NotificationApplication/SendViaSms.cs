using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NotificationApplication
{
    public class SendViaSms
    {
        public List<string> SmsList { get; set; }

        public SendViaSms()
        {
            SmsList = new List<string>();
        }

        public void Subscribe(string phone)
        {
            SmsList.Add(phone);
        }

        public void Unsubscribe(string phone)
        {
            SmsList.Remove(phone);
        }

        public bool ValidateFormat(string phone)
        {
            var validation = new FormatValidation();

            return validation.ValidateSMS(phone);
        }

        public bool IsExisted(string phone)
        {
            return SmsList.Any(x => x == phone);
        }

    }
}
