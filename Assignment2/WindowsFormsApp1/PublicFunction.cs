using System.Collections.Generic;
using System.Data;
using System.Windows.Forms;

namespace WindowsFormsApp1
{
    internal class PublicFunction
    {
        /// <summary>
        /// create datatable by passing class
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
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

        public void ClearDgv(Control ctx)
        {
            DataGridView dgv = ctx as DataGridView;
            dgv.DataSource = null;
            dgv.Rows.Clear();
            dgv.Refresh();
        }

        /// <summary>
        /// upper case string
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public string TrimString(string str)
        {
            return str.Trim();
        }

        /// <summary>
        /// trim blank
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public string UpperCase(string str)
        {
            return str.ToUpper();
        }
    }

    internal class Component
    {
        public Dictionary<Control, object> OriginalDic;

        public Component()
        {
            OriginalDic = new Dictionary<Control, object>();
        }

        public void SaveControlsToDic(Control control)
        {
            if (control is TextBox || control is ComboBox )
            {
                OriginalDic.Add(control, control.Name);
            }
            else if (control is FlowLayoutPanel)
            {
                foreach (Control control1 in (control as FlowLayoutPanel).Controls)
                {
                    SaveControlsToDic(control1);
                }
            }
        }
    }
}