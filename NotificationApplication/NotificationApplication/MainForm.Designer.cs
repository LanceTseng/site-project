namespace NotificationApplication
{
    partial class MainForm
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
            this.btnManage = new System.Windows.Forms.Button();
            this.btnPublish = new System.Windows.Forms.Button();
            this.btnExit = new System.Windows.Forms.Button();
            this.btnSubscribeRecord = new System.Windows.Forms.Button();
            this.btnCourseRecord = new System.Windows.Forms.Button();
            this.btnPublishRecord = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // btnManage
            // 
            this.btnManage.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnManage.Location = new System.Drawing.Point(38, 67);
            this.btnManage.Name = "btnManage";
            this.btnManage.Size = new System.Drawing.Size(348, 80);
            this.btnManage.TabIndex = 0;
            this.btnManage.Text = "Manage Subscription";
            this.btnManage.UseVisualStyleBackColor = true;
            this.btnManage.Click += new System.EventHandler(this.btnManage_Click);
            // 
            // btnPublish
            // 
            this.btnPublish.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnPublish.Location = new System.Drawing.Point(449, 67);
            this.btnPublish.Name = "btnPublish";
            this.btnPublish.Size = new System.Drawing.Size(348, 80);
            this.btnPublish.TabIndex = 1;
            this.btnPublish.Text = "Publish Notification";
            this.btnPublish.UseVisualStyleBackColor = true;
            this.btnPublish.Click += new System.EventHandler(this.btnPublish_Click);
            // 
            // btnExit
            // 
            this.btnExit.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnExit.Location = new System.Drawing.Point(836, 67);
            this.btnExit.Name = "btnExit";
            this.btnExit.Size = new System.Drawing.Size(186, 80);
            this.btnExit.TabIndex = 2;
            this.btnExit.Text = "Exit";
            this.btnExit.UseVisualStyleBackColor = true;
            this.btnExit.Click += new System.EventHandler(this.btnExit_Click);
            // 
            // btnSubscribeRecord
            // 
            this.btnSubscribeRecord.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnSubscribeRecord.Location = new System.Drawing.Point(38, 160);
            this.btnSubscribeRecord.Name = "btnSubscribeRecord";
            this.btnSubscribeRecord.Size = new System.Drawing.Size(348, 80);
            this.btnSubscribeRecord.TabIndex = 3;
            this.btnSubscribeRecord.Text = "Subscribe Record";
            this.btnSubscribeRecord.UseVisualStyleBackColor = true;
            this.btnSubscribeRecord.Click += new System.EventHandler(this.btnSubscribeRecord_Click);
            // 
            // btnCourseRecord
            // 
            this.btnCourseRecord.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnCourseRecord.Location = new System.Drawing.Point(836, 160);
            this.btnCourseRecord.Name = "btnCourseRecord";
            this.btnCourseRecord.Size = new System.Drawing.Size(186, 80);
            this.btnCourseRecord.TabIndex = 4;
            this.btnCourseRecord.Text = "Course List";
            this.btnCourseRecord.UseVisualStyleBackColor = true;
            this.btnCourseRecord.Click += new System.EventHandler(this.btnCourseRecord_Click);
            // 
            // btnPublishRecord
            // 
            this.btnPublishRecord.Font = new System.Drawing.Font("PMingLiU", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(136)));
            this.btnPublishRecord.Location = new System.Drawing.Point(449, 160);
            this.btnPublishRecord.Name = "btnPublishRecord";
            this.btnPublishRecord.Size = new System.Drawing.Size(348, 80);
            this.btnPublishRecord.TabIndex = 5;
            this.btnPublishRecord.Text = "Publish Record";
            this.btnPublishRecord.UseVisualStyleBackColor = true;
            this.btnPublishRecord.Click += new System.EventHandler(this.btnPublishRecord_Click);
            // 
            // MainForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 18F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1112, 312);
            this.Controls.Add(this.btnPublishRecord);
            this.Controls.Add(this.btnCourseRecord);
            this.Controls.Add(this.btnSubscribeRecord);
            this.Controls.Add(this.btnExit);
            this.Controls.Add(this.btnPublish);
            this.Controls.Add(this.btnManage);
            this.Name = "MainForm";
            this.Text = "Notification Manager";
            this.Load += new System.EventHandler(this.MainForm_Load);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button btnManage;
        private System.Windows.Forms.Button btnPublish;
        private System.Windows.Forms.Button btnExit;
        private System.Windows.Forms.Button btnSubscribeRecord;
        private System.Windows.Forms.Button btnCourseRecord;
        private System.Windows.Forms.Button btnPublishRecord;
    }
}

