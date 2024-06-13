using System;
using System.Drawing;
using System.Windows.Forms;

namespace NotificationApplication
{
    public partial class ManageSubscriptionForm : Form
    {
        private SendViaEmail _sendViaEmail;
        private SendViaSms _sendViaSms;

        public ManageSubscriptionForm()
        {
            InitializeComponent();
        }

        public ManageSubscriptionForm(SendViaEmail sendViaEmail, SendViaSms sendViaSms)
        {
            InitializeComponent();
            this._sendViaEmail = sendViaEmail;
            this._sendViaSms = sendViaSms;
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void ckbEmail_CheckedChanged(object sender, EventArgs e)
        {
            if (ckbEmail.Checked)
            {
                txtSMS.Enabled = false;
            }
            else
            {
                txtSMS.Enabled = true;
            }
        }

        private void ckbSMS_CheckedChanged(object sender, EventArgs e)
        {
            if (ckbSMS.Checked)
            {
                txtEmail.Enabled = false;
            }
            else
            {
                txtEmail.Enabled = true;
            }
        }

        private void ManageSubscriptionForm_Load(object sender, EventArgs e)
        {
            ClearErrorMsg();
        }

        private void btnSubscribe_Click(object sender, EventArgs e)
        {
            ClearErrorMsg();

            if (ckbEmail.Checked && ckbSMS.Checked)
            {
                MessageBox.Show("Please select one only");
                return;
            }

            if (ckbEmail.Checked)
            {
                if (!_sendViaEmail.ValidateFormat(txtEmail.Text))
                {
                    ShowErrorMsg("Invalid email address.", lblErrorEmail, true);
                    return;
                }

                if (_sendViaEmail.IsExisted(txtEmail.Text))
                {
                    ShowErrorMsg("Duplicate email address.", lblErrorEmail, true);
                    return;
                }
            }

            if (ckbSMS.Checked)
            {
                if (!_sendViaSms.ValidateFormat(txtSMS.Text))
                {
                    ShowErrorMsg("Invalid phone number.", lblErrorSMS, true);
                    return;
                }
                if (_sendViaSms.IsExisted(txtSMS.Text))
                {
                    ShowErrorMsg("Duplicate phone number.", lblErrorSMS, true);
                    return;
                }
            }

            var lbl = new Label();
            var type = string.Empty;
            if (ckbEmail.Checked)
            {
                _sendViaEmail.Subscribe(txtEmail.Text);
                lbl = lblErrorEmail;
                type = "Email";
            }
            if (ckbSMS.Checked)
            {
                _sendViaSms.Subscribe(txtSMS.Text);
                lbl = lblErrorSMS;
                type = "SMS";
            }

            ShowSuccessMsg($"{type} subscribed successfully.", lbl, true);
        }

        private void btnUnsubscribe_Click(object sender, EventArgs e)
        {
            ClearErrorMsg();

            var type = string.Empty;
            var lbl = new Label();
            if (ckbEmail.Checked)
            {
                lbl = lblErrorEmail;
                type = "Email";
                if (!_sendViaEmail.IsExisted(txtEmail.Text))
                {
                    ShowErrorMsg("Subscriber not exist.", lbl, true);
                    return;
                }
 
                _sendViaEmail.Unsubscribe(txtEmail.Text);
            }
            if (ckbSMS.Checked)
            {
                type = "SMS";
                lbl = lblErrorSMS;

                if (!_sendViaSms.IsExisted(txtEmail.Text))
                {
                    ShowErrorMsg("Subscriber not exist.", lbl, true);
                    return;
                }

                _sendViaSms.Unsubscribe(txtSMS.Text);
            }

            ShowSuccessMsg($"{type} unsubscribed successfully.", lbl, true);
        }

        private void ShowErrorMsg(string msg, Label lbl, bool isVisible)
        {
            lbl.Text = msg;
            lbl.Visible = isVisible;
            lbl.ForeColor = Color.Red;
        }

        private void ShowSuccessMsg(string msg, Label lbl, bool isVisible)
        {
            lbl.ForeColor = Color.Green;
            lbl.Text = msg;
            lbl.Visible = isVisible;
        }

        public void ClearErrorMsg()
        {
            ShowErrorMsg("", lblErrorEmail, false);
            ShowErrorMsg("", lblErrorSMS, false);
        }
    }
}