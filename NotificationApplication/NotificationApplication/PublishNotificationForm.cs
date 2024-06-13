    using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace NotificationApplication
{
    public partial class PublishNotificationForm : Form
    {
        private SendViaEmail _sendViaEmail;
        private SendViaSms _sendViaSms;
        private PublishRecord _publishRecord;
        
        List<Subscription> subscriptions = new List<Subscription>();
        public PublishNotificationForm()
        {
            InitializeComponent();
        }

        public PublishNotificationForm(SendViaEmail sendViaEmail, SendViaSms sendViaSms, PublishRecord publishRecord)
        {
            InitializeComponent();
            this._sendViaEmail = sendViaEmail;
            this._sendViaSms = sendViaSms;
            this._publishRecord = publishRecord;
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        public void NotificationRegistor()
        {
            subscriptions.Clear();

            _publishRecord.NewContent = null;

            foreach (var v in _sendViaEmail.EmailList)
            {
                subscriptions.Add(new Subscription()
                {
                    Type = "Email",
                    Subscriber = v
                });
            }
            foreach (var v in _sendViaSms.SmsList)
            {
                subscriptions.Add(new Subscription()
                {
                    Type = "SMS",
                    Subscriber = v
                });
            }

            
            foreach (Subscription subscription in subscriptions)
            {
                _publishRecord.NewContent += subscription.GetNotification;
            }
        }

        private void btnPublish_Click(object sender, EventArgs e)
        {
            NotificationRegistor();

            _publishRecord.PublishContent(txtContent.Text);

            AddHistory();
        }

        private void AddHistory()
        {
            foreach (Subscription subscription in subscriptions)
            {
                _publishRecord.PublishHistory.Add(new PublishHistory()
                {
                    Subscriber = subscription.Subscriber,
                    Content = txtContent.Text,
                    PublishTime = DateTime.Now
                });
            }
        }
    }
}
