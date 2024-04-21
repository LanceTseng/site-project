using System;
using System.Drawing;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using WindowsFormsApp1.Model;

namespace WindowsFormsApp1
{
    public partial class BaseForm : Form
    {
        private Library _library = new Library();

        public BaseForm()
        {
            InitializeComponent();

            UILoad();
            UiEventRegistor();
            DisplayView();
        }

        private void BaseForm_Load(object sender, EventArgs e)
        {
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Text = "Library Management System - 4558302";
        }

        /// <summary>
        /// assign event to each component
        /// </summary>
        private void UiEventRegistor()
        {
            btnAdd.Click += BtnMaintain_Click;
            btnRemove.Click += BtnMaintain_Click;
            btnSearch.Click += BtnMaintain_Click;
        }

        /// <summary>
        /// Load category selection items
        /// </summary>
        private void UILoad()
        {
            foreach (var c in _library.GetCategoryType())
            {
                cmbCategory.Items.Add(c);
            }
        }

        /// <summary>
        /// show the book list
        /// </summary>
        private void DisplayView()
        {
            new PublicFunction().ClearDgv(dgvMaintain);

            dgvMaintain.DataSource = _library.DisplayData(_library.getBookList());
        }

        /// <summary>
        /// process add/remove/search book action
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BtnMaintain_Click(object sender, EventArgs e)
        {
            var btn = (Button)sender as Button;

            switch (btn.Tag.ToString())
            {
                case "+":
                    if (!ValidateBook())
                        return;

                    AddBook();
                    DisplayView();
                    ClearTextbox();
                    break;

                case "-":
                    RemoveBook();
                    DisplayView();
                    break;

                case "search":
                    SearchBook();
                    break;
            }
        }

        /// <summary>
        /// add book function
        /// </summary>
        private void AddBook()
        {
            var book = new Book()
            {
                Code = txtCode.Text,
                Title = new PublicFunction().UpperCase(txtTitle.Text),
                Author = new PublicFunction().TrimString(txtAuthur.Text),
                ISBN = txtIsbn.Text,
                Category = cmbCategory.Text,
                Available = true
            };

            _library.AddBook(book);
        }

        /// <summary>
        /// remove book function
        /// </summary>
        private void RemoveBook()
        {
            var dgvCurrentIndex = dgvMaintain.CurrentRow.Index;

            var book = new Book()
            {
                Code = dgvMaintain.Rows[dgvCurrentIndex].Cells["Code"].Value.ToString()
            };
            _library.RemoveBook(book);
        }

        /// <summary>
        /// query book function
        /// </summary>
        private void SearchBook()
        {
            var filter = _library.SearchByCondition(txtCode.Text, txtTitle.Text, txtAuthur.Text, txtIsbn.Text, cmbCategory.Text);

            new PublicFunction().ClearDgv(dgvMaintain);

            dgvMaintain.DataSource = filter;
        }

        /// <summary>
        /// validation rule function
        /// </summary>
        /// <returns></returns>
        private bool ValidateBook()
        {
            if (!ValidateEmptyInput())
                return false;

            if (!ValidateISBNFormat())
                return false;

            if (!DuplicateCode())
                return false;

            return true;
        }
        
        /// <summary>
        /// check input empty
        /// </summary>
        /// <returns></returns>
        private bool ValidateEmptyInput()
        {
            var component = new Component();
            component.SaveControlsToDic(flowLayoutPanel1);

            foreach (Control ctx in component.OriginalDic.Keys)
            {
                if (ctx is TextBox && string.IsNullOrEmpty(ctx.Text))
                {
                    var txt = (TextBox)ctx;
                    txt.BackColor = Color.HotPink;
                    txt.Focus();
                    txt.SelectAll();
                    MessageBox.Show("Hightlight text is empty.");
                    return false;
                }

                if (ctx is ComboBox && string.IsNullOrEmpty(ctx.Text))
                {
                    var cmb = (ComboBox)ctx;
                    cmb.BackColor = Color.HotPink;
                    cmb.Focus();
                    cmb.SelectAll();
                    MessageBox.Show("Hightlight is empty.");
                    return false;
                }

                ctx.BackColor = SystemColors.Control;
            }

            return true;
        }

        /// <summary>
        /// check ISBN format
        /// </summary>
        /// <returns></returns>
        private bool ValidateISBNFormat()
        {
            string pattern = @"^\d{9}[\d|X]$|^\d{13}$";

            if (!Regex.IsMatch(new PublicFunction().TrimString(txtIsbn.Text), pattern))
            {
                txtIsbn.BackColor = Color.HotPink;
                txtIsbn.Focus();
                txtIsbn.SelectAll();
                MessageBox.Show("ISBN format error.");
                return false;
            }
            txtIsbn.BackColor = SystemColors.Control;

            return true;
        }

        /// <summary>
        /// check code duplicate
        /// </summary>
        /// <returns></returns>
        private bool DuplicateCode()
        {
            var isCodeExist = _library.getBookList().Exists(x => x.Code == txtCode.Text);

            if (isCodeExist)
            {
                txtIsbn.BackColor = Color.HotPink;
                txtIsbn.Focus();
                txtIsbn.SelectAll();
                MessageBox.Show("Code is duplicate.");
                return false;
            }

            txtCode.BackColor = SystemColors.Control;

            return true;
        }

        /// <summary>
        /// clear input data
        /// </summary>
        private void ClearTextbox()
        {
            var component = new Component();
            component.SaveControlsToDic(flowLayoutPanel1);
            foreach (Control ctx in component.OriginalDic.Keys)
            {
                if (ctx is TextBox || ctx is ComboBox)
                {
                    ctx.Text = string.Empty;
                }
            }
        }
    }
}