using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NotificationApplication
{
    public class SendViaEmail
    {
        public List<string> EmailList { get; set; }

        public SendViaEmail()
        {
            EmailList = new List<string>();
        }
        public void Subscribe(string email)
        {
            EmailList.Add(email);
        }

        public void Unsubscribe(string email)
        {
            EmailList.Remove(email);
        }

        public bool ValidateFormat(string email)
        {
            var validation = new FormatValidation();

            return validation.ValidateEmail(email);
        }

        public bool IsExisted(string email)
        {
            return EmailList.Any(x => x == email);
        }

      
    }
}
