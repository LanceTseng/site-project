namespace NotificationApplication
{
    partial class ManageSubscriptionForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.ckbEmail = new System.Windows.Forms.CheckBox();
            this.ckbSMS = new System.Windows.Forms.CheckBox();
            this.btnSubscribe = new System.Windows.Forms.Button();
            this.btnUnsbuscribe = new System.Windows.Forms.Button();
            this.btnCancel = new System.Windows.Forms.Button();
            this.txtEmail = new System.Windows.Forms.TextBox();
            this.txtSMS = new System.Windows.Forms.TextBox();
            this.lblErrorEmail = new System.Windows.Forms.Label();
            this.lblErrorSMS = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // ckbEmail
            // 
            this.ckbEmail.AutoSize = true;
            this.ckbEmail.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.ckbEmail.Location = new System.Drawing.Point(86, 82);
            this.ckbEmail.Name = "ckbEmail";
            this.ckbEmail.Size = new System.Drawing.Size(320, 32);
            this.ckbEmail.TabIndex = 0;
            this.ckbEmail.Text = "Notification Sent by Email";
            this.ckbEmail.UseVisualStyleBackColor = true;
            this.ckbEmail.CheckedChanged += new System.EventHandler(this.ckbEmail_CheckedChanged);
            // 
            // ckbSMS
            // 
            this.ckbSMS.AutoSize = true;
            this.ckbSMS.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.ckbSMS.Location = new System.Drawing.Point(86, 161);
            this.ckbSMS.Name = "ckbSMS";
            this.ckbSMS.Size = new System.Drawing.Size(316, 32);
            this.ckbSMS.TabIndex = 1;
            this.ckbSMS.Text = "Notification Sent By SMS";
            this.ckbSMS.UseVisualStyleBackColor = true;
            this.ckbSMS.CheckedChanged += new System.EventHandler(this.ckbSMS_CheckedChanged);
            // 
            // btnSubscribe
            // 
            this.btnSubscribe.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnSubscribe.Location = new System.Drawing.Point(58, 269);
            this.btnSubscribe.Name = "btnSubscribe";
            this.btnSubscribe.Size = new System.Drawing.Size(186, 80);
            this.btnSubscribe.TabIndex = 3;
            this.btnSubscribe.Text = "Subscribe";
            this.btnSubscribe.UseVisualStyleBackColor = true;
            this.btnSubscribe.Click += new System.EventHandler(this.btnSubscribe_Click);
            // 
            // btnUnsbuscribe
            // 
            this.btnUnsbuscribe.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnUnsbuscribe.Location = new System.Drawing.Point(301, 269);
            this.btnUnsbuscribe.Name = "btnUnsbuscribe";
            this.btnUnsbuscribe.Size = new System.Drawing.Size(186, 80);
            this.btnUnsbuscribe.TabIndex = 4;
            this.btnUnsbuscribe.Text = "Unsbuscribe";
            this.btnUnsbuscribe.UseVisualStyleBackColor = true;
            this.btnUnsbuscribe.Click += new System.EventHandler(this.btnUnsubscribe_Click);
            // 
            // btnCancel
            // 
            this.btnCancel.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnCancel.Location = new System.Drawing.Point(544, 269);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(186, 80);
            this.btnCancel.TabIndex = 5;
            this.btnCancel.Text = "Cancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // txtEmail
            // 
            this.txtEmail.Font = new System.Drawing.Font("PMingLiU", 14F);
            this.txtEmail.Location = new System.Drawing.Point(420, 73);
            this.txtEmail.Name = "txtEmail";
            this.txtEmail.Size = new System.Drawing.Size(310, 41);
            this.txtEmail.TabIndex = 6;
            // 
            // txtSMS
            // 
            this.txtSMS.Font = new System.Drawing.Font("PMingLiU", 14F);
            this.txtSMS.Location = new System.Drawing.Point(420, 159);
            this.txtSMS.Name = "txtSMS";
            this.txtSMS.Size = new System.Drawing.Size(310, 41);
            this.txtSMS.TabIndex = 7;
            // 
            // lblErrorEmail
            // 
            this.lblErrorEmail.AutoSize = true;
            this.lblErrorEmail.ForeColor = System.Drawing.Color.Red;
            this.lblErrorEmail.Location = new System.Drawing.Point(417, 127);
            this.lblErrorEmail.Name = "lblErrorEmail";
            this.lblErrorEmail.Size = new System.Drawing.Size(50, 18);
            this.lblErrorEmail.TabIndex = 8;
            this.lblErrorEmail.Text = "label1";
            // 
            // lblErrorSMS
            // 
            this.lblErrorSMS.AutoSize = true;
            this.lblErrorSMS.ForeColor = System.Drawing.Color.Red;
            this.lblErrorSMS.Location = new System.Drawing.Point(417, 213);
            this.lblErrorSMS.Name = "lblErrorSMS";
            this.lblErrorSMS.Size = new System.Drawing.Size(50, 18);
            this.lblErrorSMS.TabIndex = 9;
            this.lblErrorSMS.Text = "label1";
            // 
            // ManageSubscriptionForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 18F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 450);
            this.Controls.Add(this.lblErrorSMS);
            this.Controls.Add(this.lblErrorEmail);
            this.Controls.Add(this.txtSMS);
            this.Controls.Add(this.txtEmail);
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.btnUnsbuscribe);
            this.Controls.Add(this.btnSubscribe);
            this.Controls.Add(this.ckbSMS);
            this.Controls.Add(this.ckbEmail);
            this.Name = "ManageSubscriptionForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Manage Subscription";
            this.Load += new System.EventHandler(this.ManageSubscriptionForm_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.CheckBox ckbEmail;
        private System.Windows.Forms.CheckBox ckbSMS;
        private System.Windows.Forms.Button btnSubscribe;
        private System.Windows.Forms.Button btnUnsbuscribe;
        private System.Windows.Forms.Button btnCancel;
        private System.Windows.Forms.TextBox txtEmail;
        private System.Windows.Forms.TextBox txtSMS;
        private System.Windows.Forms.Label lblErrorEmail;
        private System.Windows.Forms.Label lblErrorSMS;
    }
}