using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NotificationApplication
{
    public class Subscription
    {
        public string Type { get; set; } //Email or SMS
        public string Subscriber { get; set; } //Email or PhoneNumber

        public void GetNotification(string content)
        {
            MessageBox.Show($"This is {Subscriber}. The latest content: {content}", "Notification", MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }
    }
}
