namespace FlickrViewer
{
   partial class FickrViewerForm
   {
      /// <summary>
      /// Required designer variable.
      /// </summary>
      private System.ComponentModel.IContainer components = null;

      /// <summary>
      /// Clean up any resources being used.
      /// </summary>
      /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
      protected override void Dispose( bool disposing )
      {
         if ( disposing && ( components != null ) )
         {
            components.Dispose();
         }
         base.Dispose( disposing );
      }

      #region Windows Form Designer generated code

      /// <summary>
      /// Required method for Designer support - do not modify
      /// the contents of this method with the code editor.
      /// </summary>
      private void InitializeComponent()
      {
            this.label1 = new System.Windows.Forms.Label();
            this.inputTextBox = new System.Windows.Forms.TextBox();
            this.searchButton = new System.Windows.Forms.Button();
            this.imagesListBox = new System.Windows.Forms.ListBox();
            this.pictureBox = new System.Windows.Forms.PictureBox();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.btnOpenFilePath = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(18, 22);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(214, 18);
            this.label1.TabIndex = 0;
            this.label1.Text = "Enter Flickr search tags here:";
            // 
            // inputTextBox
            // 
            this.inputTextBox.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.inputTextBox.Location = new System.Drawing.Point(244, 18);
            this.inputTextBox.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.inputTextBox.Name = "inputTextBox";
            this.inputTextBox.Size = new System.Drawing.Size(1018, 29);
            this.inputTextBox.TabIndex = 1;
            // 
            // searchButton
            // 
            this.searchButton.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.searchButton.Location = new System.Drawing.Point(1274, 15);
            this.searchButton.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.searchButton.Name = "searchButton";
            this.searchButton.Size = new System.Drawing.Size(105, 32);
            this.searchButton.TabIndex = 4;
            this.searchButton.Text = "Search";
            this.searchButton.UseVisualStyleBackColor = true;
            this.searchButton.Click += new System.EventHandler(this.searchButton_Click);
            // 
            // imagesListBox
            // 
            this.imagesListBox.FormattingEnabled = true;
            this.imagesListBox.ItemHeight = 18;
            this.imagesListBox.Location = new System.Drawing.Point(22, 55);
            this.imagesListBox.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.imagesListBox.Name = "imagesListBox";
            this.imagesListBox.Size = new System.Drawing.Size(211, 724);
            this.imagesListBox.TabIndex = 5;
            this.imagesListBox.SelectedIndexChanged += new System.EventHandler(this.imagesListBox_SelectedIndexChanged);
            // 
            // pictureBox
            // 
            this.pictureBox.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.pictureBox.Location = new System.Drawing.Point(244, 55);
            this.pictureBox.Margin = new System.Windows.Forms.Padding(4);
            this.pictureBox.Name = "pictureBox";
            this.pictureBox.Size = new System.Drawing.Size(541, 730);
            this.pictureBox.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
            this.pictureBox.TabIndex = 6;
            this.pictureBox.TabStop = false;
            // 
            // pictureBox1
            // 
            this.pictureBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.pictureBox1.Location = new System.Drawing.Point(803, 91);
            this.pictureBox1.Margin = new System.Windows.Forms.Padding(4);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(576, 694);
            this.pictureBox1.SizeMode = System.Windows.Forms.PictureBoxSizeMode.CenterImage;
            this.pictureBox1.TabIndex = 7;
            this.pictureBox1.TabStop = false;
            // 
            // btnOpenFilePath
            // 
            this.btnOpenFilePath.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.btnOpenFilePath.Location = new System.Drawing.Point(803, 55);
            this.btnOpenFilePath.Margin = new System.Windows.Forms.Padding(4);
            this.btnOpenFilePath.Name = "btnOpenFilePath";
            this.btnOpenFilePath.Size = new System.Drawing.Size(192, 32);
            this.btnOpenFilePath.TabIndex = 8;
            this.btnOpenFilePath.Text = "Thumbnail Location";
            this.btnOpenFilePath.UseVisualStyleBackColor = true;
            this.btnOpenFilePath.Click += new System.EventHandler(this.btnOpenFilePath_Click);
            // 
            // FickrViewerForm
            // 
            this.AcceptButton = this.searchButton;
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 18F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(1396, 798);
            this.Controls.Add(this.btnOpenFilePath);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.pictureBox);
            this.Controls.Add(this.imagesListBox);
            this.Controls.Add(this.searchButton);
            this.Controls.Add(this.inputTextBox);
            this.Controls.Add(this.label1);
            this.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.Name = "FickrViewerForm";
            this.Text = "Flickr Viewer";
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

      }

      #endregion

      private System.Windows.Forms.Label label1;
      private System.Windows.Forms.TextBox inputTextBox;
      private System.Windows.Forms.Button searchButton;
      private System.Windows.Forms.ListBox imagesListBox;
        private System.Windows.Forms.PictureBox pictureBox;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Button btnOpenFilePath;
    }
}

