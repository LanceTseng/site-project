using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NotificationApplication
{
    public class PublishRecord
    {
        public List<PublishHistory> PublishHistory { get; set; }

        public delegate void NotificateObject(string content);

        public NotificateObject NewContent;

        public void PublishContent(string content)
        {
            //觸發事件
            NewContent.Invoke(content);
        }

        public PublishRecord()
        {
            PublishHistory = new List<PublishHistory>();
        }
    }

    public class PublishHistory
    {
        public string Subscriber { get; set; }
        public string Content { get; set; }
        public DateTime PublishTime { get; set; }
    }
}
