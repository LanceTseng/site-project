using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace NotificationApplication
{
    public partial class MainForm : Form
    {
        public CourseRecord CourseRecord = new CourseRecord();
        public SendViaEmail SendViaEmail = new SendViaEmail();
        public SendViaSms SendViaSms = new SendViaSms();
        private PublishRecord PublishRecord = new PublishRecord();

        public MainForm()
        {
            InitializeComponent();
        }

        private void btnExit_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            PublishButtonState();
        }

        private void btnManage_Click(object sender, EventArgs e)
        {
            var frmManage = new ManageSubscriptionForm(SendViaEmail, SendViaSms);
            frmManage.ShowDialog();

            PublishButtonState();
        }

        public void PublishButtonState()
        {
            if (SendViaEmail.EmailList.Any() || SendViaSms.SmsList.Any())
                this.btnPublish.Enabled = true;
            else
                this.btnPublish.Enabled = false;
        }

        private void btnSubscribeRecord_Click(object sender, EventArgs e)
        {
            var subscriptions = new List<Subscription>();
            foreach (var v in SendViaEmail.EmailList)
            {
                subscriptions.Add(new Subscription()
                {
                    Type = "Email",
                    Subscriber = v
                });
            }
            foreach (var v in SendViaSms.SmsList)
            {
                subscriptions.Add(new Subscription()
                {
                    Type = "SMS",
                    Subscriber = v
                });
            }

            var dataGridView1 = new DataGridView();
            dataGridView1.AutoGenerateColumns = false;

            dataGridView1.Columns.Add(new DataGridViewTextBoxColumn() { HeaderText = "Type", DataPropertyName = "Type" });
            dataGridView1.Columns.Add(new DataGridViewTextBoxColumn() { HeaderText = "Subscriber", DataPropertyName = "Subscriber" });

            dataGridView1.DataSource = subscriptions;
            dataGridView1.Dock = DockStyle.Fill;

            var frm = new Form();
            frm.Text = "Subscribe List";
            frm.Size = new Size(800, 600);
            frm.StartPosition = FormStartPosition.CenterScreen;
            frm.Controls.Add(dataGridView1);
            frm.Show();
        }

        private void btnCourseRecord_Click(object sender, EventArgs e)
        {
            var dt = new DataTable();
            dt.Columns.Add("Code", typeof(string));
            dt.Columns.Add("Title", typeof(string));
            dt.Columns.Add("Description", typeof(string));
            dt.Columns.Add("Credits", typeof(int));
            foreach (var kvp in CourseRecord.Courses)
            {
                dt.Rows.Add(kvp.Key, kvp.Value.Title, kvp.Value.Description, kvp.Value.Credits);
            }

            var frm = new Form();
            frm.Text = "Course List";
            frm.Size = new Size(800, 600);
            frm.StartPosition = FormStartPosition.CenterScreen;

            var dataGridView1 = new DataGridView();

            dataGridView1.DataSource = dt;
            dataGridView1.Dock = DockStyle.Fill;

            frm.Controls.Add(dataGridView1);
            frm.Show();
        }

        private void btnPublish_Click(object sender, EventArgs e)
        {
            var frmPublish = new PublishNotificationForm(SendViaEmail, SendViaSms, PublishRecord);
            frmPublish.Show();
        }

        private void btnPublishRecord_Click(object sender, EventArgs e)
        {
            var dataGridView1 = new DataGridView();
            dataGridView1.AutoGenerateColumns = false;

            dataGridView1.Columns.Add(new DataGridViewTextBoxColumn() { HeaderText = "Subscriber", DataPropertyName = "Subscriber" });
            dataGridView1.Columns.Add(new DataGridViewTextBoxColumn() { HeaderText = "Content", DataPropertyName = "Content" });
            dataGridView1.Columns.Add(new DataGridViewTextBoxColumn() { HeaderText = "PublishTime", DataPropertyName = "PublishTime" });

            dataGridView1.DataSource = PublishRecord.PublishHistory;
            dataGridView1.Dock = DockStyle.Fill;

            var frm = new Form();
            frm.Text = "Subscribe List";
            frm.Size = new Size(800, 600);
            frm.StartPosition = FormStartPosition.CenterScreen;
            frm.Controls.Add(dataGridView1);
            frm.Show();
        }
    }
}