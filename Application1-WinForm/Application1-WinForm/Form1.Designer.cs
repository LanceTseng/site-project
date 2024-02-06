namespace Application1_WinForm
{
    partial class Form1
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
            this.panel1 = new System.Windows.Forms.Panel();
            this.btnClearSelection = new System.Windows.Forms.Button();
            this.btnReport = new System.Windows.Forms.Button();
            this.btnEndTest = new System.Windows.Forms.Button();
            this.btnNext = new System.Windows.Forms.Button();
            this.btnPrevious = new System.Windows.Forms.Button();
            this.btnSubmit = new System.Windows.Forms.Button();
            this.panel6 = new System.Windows.Forms.Panel();
            this.dgvReportMini = new System.Windows.Forms.DataGridView();
            this.panel5 = new System.Windows.Forms.Panel();
            this.lblScore = new System.Windows.Forms.Label();
            this.lblQuestionQty = new System.Windows.Forms.Label();
            this.panel4 = new System.Windows.Forms.Panel();
            this.lblMsg = new System.Windows.Forms.Label();
            this.panelOption = new System.Windows.Forms.Panel();
            this.panelQuestion = new System.Windows.Forms.Panel();
            this.panel1.SuspendLayout();
            this.panel6.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.dgvReportMini)).BeginInit();
            this.panel5.SuspendLayout();
            this.panel4.SuspendLayout();
            this.SuspendLayout();
            // 
            // panel1
            // 
            this.panel1.BackColor = System.Drawing.SystemColors.ActiveCaption;
            this.panel1.Controls.Add(this.btnClearSelection);
            this.panel1.Controls.Add(this.btnReport);
            this.panel1.Controls.Add(this.btnEndTest);
            this.panel1.Controls.Add(this.btnNext);
            this.panel1.Controls.Add(this.btnPrevious);
            this.panel1.Controls.Add(this.btnSubmit);
            this.panel1.Controls.Add(this.panel6);
            this.panel1.Controls.Add(this.panel5);
            this.panel1.Controls.Add(this.panel4);
            this.panel1.Controls.Add(this.panelOption);
            this.panel1.Controls.Add(this.panelQuestion);
            this.panel1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.panel1.Location = new System.Drawing.Point(0, 0);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(1420, 921);
            this.panel1.TabIndex = 0;
            // 
            // btnClearSelection
            // 
            this.btnClearSelection.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnClearSelection.Location = new System.Drawing.Point(730, 338);
            this.btnClearSelection.Margin = new System.Windows.Forms.Padding(4);
            this.btnClearSelection.Name = "btnClearSelection";
            this.btnClearSelection.Size = new System.Drawing.Size(207, 81);
            this.btnClearSelection.TabIndex = 8;
            this.btnClearSelection.Text = "Clear Selection";
            this.btnClearSelection.UseVisualStyleBackColor = true;
            // 
            // btnReport
            // 
            this.btnReport.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnReport.Location = new System.Drawing.Point(730, 642);
            this.btnReport.Margin = new System.Windows.Forms.Padding(4);
            this.btnReport.Name = "btnReport";
            this.btnReport.Size = new System.Drawing.Size(207, 81);
            this.btnReport.TabIndex = 7;
            this.btnReport.Text = "Report";
            this.btnReport.UseVisualStyleBackColor = true;
            // 
            // btnEndTest
            // 
            this.btnEndTest.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnEndTest.Location = new System.Drawing.Point(730, 537);
            this.btnEndTest.Margin = new System.Windows.Forms.Padding(4);
            this.btnEndTest.Name = "btnEndTest";
            this.btnEndTest.Size = new System.Drawing.Size(207, 81);
            this.btnEndTest.TabIndex = 6;
            this.btnEndTest.Text = "End Test";
            this.btnEndTest.UseVisualStyleBackColor = true;
            // 
            // btnNext
            // 
            this.btnNext.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnNext.Location = new System.Drawing.Point(850, 426);
            this.btnNext.Margin = new System.Windows.Forms.Padding(4);
            this.btnNext.Name = "btnNext";
            this.btnNext.Size = new System.Drawing.Size(87, 81);
            this.btnNext.TabIndex = 5;
            this.btnNext.Tag = "+";
            this.btnNext.Text = ">";
            this.btnNext.UseVisualStyleBackColor = true;
            // 
            // btnPrevious
            // 
            this.btnPrevious.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnPrevious.Location = new System.Drawing.Point(730, 426);
            this.btnPrevious.Margin = new System.Windows.Forms.Padding(4);
            this.btnPrevious.Name = "btnPrevious";
            this.btnPrevious.Size = new System.Drawing.Size(87, 81);
            this.btnPrevious.TabIndex = 4;
            this.btnPrevious.Tag = "-";
            this.btnPrevious.Text = "<";
            this.btnPrevious.UseVisualStyleBackColor = true;
            // 
            // btnSubmit
            // 
            this.btnSubmit.Font = new System.Drawing.Font("Calibri", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnSubmit.Location = new System.Drawing.Point(730, 249);
            this.btnSubmit.Margin = new System.Windows.Forms.Padding(4);
            this.btnSubmit.Name = "btnSubmit";
            this.btnSubmit.Size = new System.Drawing.Size(207, 81);
            this.btnSubmit.TabIndex = 3;
            this.btnSubmit.Text = "Submit";
            this.btnSubmit.UseVisualStyleBackColor = true;
            // 
            // panel6
            // 
            this.panel6.Controls.Add(this.dgvReportMini);
            this.panel6.Location = new System.Drawing.Point(946, 249);
            this.panel6.Margin = new System.Windows.Forms.Padding(4);
            this.panel6.Name = "panel6";
            this.panel6.Size = new System.Drawing.Size(375, 618);
            this.panel6.TabIndex = 2;
            // 
            // dgvReportMini
            // 
            this.dgvReportMini.AllowUserToAddRows = false;
            this.dgvReportMini.AutoSizeColumnsMode = System.Windows.Forms.DataGridViewAutoSizeColumnsMode.DisplayedCellsExceptHeader;
            this.dgvReportMini.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dgvReportMini.Dock = System.Windows.Forms.DockStyle.Fill;
            this.dgvReportMini.Location = new System.Drawing.Point(0, 0);
            this.dgvReportMini.Margin = new System.Windows.Forms.Padding(4);
            this.dgvReportMini.Name = "dgvReportMini";
            this.dgvReportMini.RowHeadersWidth = 62;
            this.dgvReportMini.RowTemplate.Height = 24;
            this.dgvReportMini.Size = new System.Drawing.Size(375, 618);
            this.dgvReportMini.TabIndex = 0;
            // 
            // panel5
            // 
            this.panel5.Controls.Add(this.lblScore);
            this.panel5.Controls.Add(this.lblQuestionQty);
            this.panel5.Location = new System.Drawing.Point(946, 44);
            this.panel5.Margin = new System.Windows.Forms.Padding(4);
            this.panel5.Name = "panel5";
            this.panel5.Size = new System.Drawing.Size(375, 160);
            this.panel5.TabIndex = 1;
            // 
            // lblScore
            // 
            this.lblScore.AutoSize = true;
            this.lblScore.Font = new System.Drawing.Font("Calibri", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblScore.Location = new System.Drawing.Point(22, 22);
            this.lblScore.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblScore.Name = "lblScore";
            this.lblScore.Size = new System.Drawing.Size(126, 50);
            this.lblScore.TabIndex = 1;
            this.lblScore.Text = "label1";
            // 
            // lblQuestionQty
            // 
            this.lblQuestionQty.AutoSize = true;
            this.lblQuestionQty.Font = new System.Drawing.Font("Calibri", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblQuestionQty.Location = new System.Drawing.Point(22, 93);
            this.lblQuestionQty.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblQuestionQty.Name = "lblQuestionQty";
            this.lblQuestionQty.Size = new System.Drawing.Size(126, 50);
            this.lblQuestionQty.TabIndex = 2;
            this.lblQuestionQty.Text = "label2";
            // 
            // panel4
            // 
            this.panel4.BackColor = System.Drawing.Color.LightSkyBlue;
            this.panel4.Controls.Add(this.lblMsg);
            this.panel4.Location = new System.Drawing.Point(62, 768);
            this.panel4.Margin = new System.Windows.Forms.Padding(4);
            this.panel4.Name = "panel4";
            this.panel4.Size = new System.Drawing.Size(843, 99);
            this.panel4.TabIndex = 1;
            // 
            // lblMsg
            // 
            this.lblMsg.AutoSize = true;
            this.lblMsg.Font = new System.Drawing.Font("Calibri", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblMsg.Location = new System.Drawing.Point(4, 18);
            this.lblMsg.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.lblMsg.Name = "lblMsg";
            this.lblMsg.Size = new System.Drawing.Size(126, 50);
            this.lblMsg.TabIndex = 1;
            this.lblMsg.Text = "label1";
            // 
            // panelOption
            // 
            this.panelOption.BackColor = System.Drawing.Color.LightSkyBlue;
            this.panelOption.Location = new System.Drawing.Point(62, 249);
            this.panelOption.Margin = new System.Windows.Forms.Padding(4);
            this.panelOption.Name = "panelOption";
            this.panelOption.Size = new System.Drawing.Size(660, 474);
            this.panelOption.TabIndex = 1;
            // 
            // panelQuestion
            // 
            this.panelQuestion.BackColor = System.Drawing.Color.LightSkyBlue;
            this.panelQuestion.Location = new System.Drawing.Point(62, 51);
            this.panelQuestion.Margin = new System.Windows.Forms.Padding(4);
            this.panelQuestion.Name = "panelQuestion";
            this.panelQuestion.Size = new System.Drawing.Size(843, 153);
            this.panelQuestion.TabIndex = 0;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 18F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1420, 921);
            this.Controls.Add(this.panel1);
            this.Name = "Form1";
            this.Text = "Quiz";
            this.Load += new System.EventHandler(this.Form1_Load);
            this.panel1.ResumeLayout(false);
            this.panel6.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.dgvReportMini)).EndInit();
            this.panel5.ResumeLayout(false);
            this.panel5.PerformLayout();
            this.panel4.ResumeLayout(false);
            this.panel4.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.Panel panel4;
        private System.Windows.Forms.Panel panelOption;
        private System.Windows.Forms.Panel panelQuestion;
        private System.Windows.Forms.Panel panel6;
        private System.Windows.Forms.DataGridView dgvReportMini;
        private System.Windows.Forms.Panel panel5;
        private System.Windows.Forms.Label lblMsg;
        private System.Windows.Forms.Label lblScore;
        private System.Windows.Forms.Label lblQuestionQty;
        private System.Windows.Forms.Button btnSubmit;
        private System.Windows.Forms.Button btnNext;
        private System.Windows.Forms.Button btnPrevious;
        private System.Windows.Forms.Button btnReport;
        private System.Windows.Forms.Button btnEndTest;
        private System.Windows.Forms.Button btnClearSelection;
    }
}

