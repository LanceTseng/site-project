using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;

namespace Application1_WinForm
{
    class PublicFunction
    {
        public void SetText(Control ctx, string strText)
        {
            ctx.Text = strText; 
        }

        public void SetTag(object obj, object objTag)
        {
            if (obj is Timer)
            {
                var ctx = obj as Timer;
                ctx.Tag = objTag;
            }
        }

        public void ClearText(Control ctx)
        {
            ctx.Text = string.Empty;
        }

        public void ClearDgv(Control ctx)
        {
            DataGridView dgv = ctx as DataGridView;
            foreach (DataGridViewRow row in dgv.Rows)
            {
                row.Dispose();
            }

            dgv.Rows.Clear();
            dgv.Refresh();
        }

        public string ConvertToTime(object strDate)
        {
            return string.IsNullOrEmpty(strDate.ToString()) ? "" : Convert.ToDateTime(strDate).ToString("HH:mm:ss");
        }

        public void CursorPosition(Control ctx)
        {
            if (ctx is TextBox)
            {
                TextBox textBox = ctx as TextBox;
                textBox.SelectAll();
            }

            ctx.Focus();
        }

        public void SettingEnable(Control ctx, bool b)
        {
            ctx.Enabled = b;
        }

        public void SettingColor(Control ctx, Color c, int rowIndex = 0)
        {
            ctx.BackColor = c;

            if (ctx is Button)
            {
                var btn = ctx as Button;
                btn.BackColor = c;
            }

            if (ctx is DataGridView)
            {
                var dgv = ctx as DataGridView;

                dgv.Rows[rowIndex].DefaultCellStyle.BackColor = c;
            }
        }

        public void RowIndexRedraw(DataGridView dgv)
        {
            int rowNumber = 1;
            foreach (DataGridViewRow row in dgv.Rows)
            {
                row.HeaderCell.Value = rowNumber.ToString();
                rowNumber++;
            }
        }

        public void SettingDataSource(Object ctx, DataTable dataTable)
        {
            if (ctx is ComboBox)
            {
                ComboBox cmb = ctx as ComboBox;
                cmb.DataSource = dataTable;
                cmb.DisplayMember = dataTable.Columns[1].ColumnName;
                cmb.ValueMember = dataTable.Columns[0].ColumnName;
            }

            if (ctx is DataGridView)
            {
                DataGridView dgv = ctx as DataGridView;
                dgv.DataSource = dataTable;

                RowIndexRedraw(dgv);
            }
        }

        private void SettingVisibleCol(DataGridView dgv, string strColName, bool boolVsbl)
        {
            dgv.Columns[strColName].Visible = boolVsbl;
        }

        private int SearchText(Object ctx, string strColName, string strSearchTxt)
        {
            DataTable dt = new DataTable();
            if (ctx is DataGridView)
            {
                DataGridView dgv = ctx as DataGridView;
                dt = (DataTable)dgv.DataSource;
            }

            if (ctx is DataTable)
            {
                dt = ctx as DataTable;
            }

            var result = dt.Rows.OfType<DataRow>().Where(r => r.Field<string>(strColName) == strSearchTxt).Count();
            if (result > 0)
            {
                return result;
            }

            return -1;
        }

        public int SearchTextRowIndex(Object ctx, string strColName, string strSearchTxt)
        {
            DataTable dt = new DataTable();
            if (ctx is DataGridView)
            {
                DataGridView dgv = ctx as DataGridView;
                dt = (DataTable)dgv.DataSource;
            }

            if (ctx is DataTable)
            {
                dt = ctx as DataTable;
            }

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                if (dt.Rows[i][strColName].Equals(strSearchTxt))
                {
                    return i;
                }
            }

            return -1;
        }

        public bool IsNumber(string s)
        {
            try
            {
                Convert.ToDouble(s);
            }
            catch
            {
                return false;
            }

            return true;
        }

        public bool IsNative(string s)
        {
            if (Convert.ToSingle(s) <= 0)
            {
                return false;
            }

            return true;
        }

        public bool IsDigit3(string s)
        {
            if (s.IndexOf('.') > 0 && s.Length - s.IndexOf('.') - 1 > 3)
            {
                return false;
            }
            return true;
        }

        public bool IsExistData(Object obj)
        {
            if (obj is DataTable)
            {
                DataTable dt = obj as DataTable;
                if (dt.Rows.Count == 0)
                {
                    return false;
                }
            } 
            return true;
        }

        public bool IsNameContain(Control ctx, string strKey)
        {
            return ctx.Name.ToLower().Contains(strKey.ToLower());
        }

        public bool IsNameEqual(Control ctx, string strKey)
        {
            return ctx.Name.ToLower().Equals(strKey.ToLower(), StringComparison.OrdinalIgnoreCase);
        }

        public bool IsObjectTextContain(String obj, string strKey)
        {
            return obj.ToLower().Contains(strKey.ToLower());
        }

        public bool IsObjectTextEqual(String obj, string strKey)
        {
            return obj.ToLower().Equals(strKey.ToLower(), StringComparison.OrdinalIgnoreCase);
        }

        public bool IsTagContain(Control ctx, string strKey)
        {
            if (ctx.Tag != null)
            {
                return ctx.Tag.ToString().ToLower().Contains(strKey.ToLower());
            }

            return false;
        }

        public Dictionary<string, object> GetDict(DataTable dt)
        {
            return dt.AsEnumerable()
                .ToDictionary<DataRow, string, object>(row => row.Field<string>(0),
                    row => row.Field<object>(1));
        }

        public DataTable CreateDataTable<T>()
        {
            var result = new DataTable();
            var dataType = typeof(T);

            foreach (var prop in dataType.GetProperties())
            {
                result.Columns.Add(prop.Name, typeof(string));
            }

            return result;
        }

    }
}
