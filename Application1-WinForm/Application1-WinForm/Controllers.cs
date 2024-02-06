using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Windows.Forms;
using Assignment1.Attributes;

namespace Application1_WinForm
{
    public class Controllers
    {
        public Dictionary<Control, object> OriginalDic;

        public Controllers()
        {
            OriginalDic = new Dictionary<Control, object>();
        }

        /// <summary>
        /// to get all element from a container
        /// </summary>
        /// <param name="control"></param>
        public void SaveControlsToDic(Control control)
        {
            if (control is RadioButton)
            {
                OriginalDic.Add(control, control.Name);
            }
            else if (control is Panel)
            {
                foreach (Control control1 in (control as Panel).Controls)
                {
                    SaveControlsToDic(control1);
                }
            }
        }

        /// <summary>
        /// get selected radiobutton element
        /// </summary>
        /// <returns></returns>
        public RadioButton SelectedRadioButton()
        {
            RadioButton radioButtonChecked = new RadioButton()
            {
                Tag = Convert.ToDecimal("0")
            };

            foreach (object control in OriginalDic.Keys)
            {
                var radioButton = control as RadioButton;

                if (radioButton.Checked)
                    radioButtonChecked = control as RadioButton;
            }

            return radioButtonChecked;
        }

        /// <summary>
        /// disable radiobutton
        /// </summary>
        /// <param name="isLock"></param>
        public void LockRadioButton(bool isLock)
        {
            if (isLock)
            {
                foreach (object control in OriginalDic.Keys)
                {
                    var radioButton = control as RadioButton;
                    radioButton.Enabled = false;
                    //radioButton.Foreground = Brushes.LightSlateGray;
                }
            }
        }

        /// <summary>
        /// show the user selection
        /// </summary>
        /// <param name="optionId"></param>
        public void RadioButtonCheck(decimal optionId)
        {
            foreach (object control in OriginalDic.Keys)
            {
                var radioButton = control as RadioButton;
                if (radioButton.Tag.Equals(optionId))
                {
                    radioButton.Checked = true;
                    return;
                }

                radioButton.Checked = false;
            }
        }

        /// <summary>
        /// Create a datatable by object
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public DataTable CreateDataTable<T>()
        {
            var result = new DataTable();
            var dataType = typeof(T);

            DataColumn col;
            foreach (var prop in dataType.GetProperties())
            {
                var attr = (ColumnAttr)Attribute.GetCustomAttribute(prop, typeof(ColumnAttr));

                if (attr != null)
                {
                    col = new DataColumn
                    {
                        ColumnName = prop.Name,
                        DataType = typeof(string),
                        Caption = string.IsNullOrEmpty(attr.HeaderText) ? "" : attr.HeaderText,
                    };
                }
                else
                {
                    col = new DataColumn
                    {
                        ColumnName = prop.Name,
                        DataType = typeof(string)
                    };
                }

                result.Columns.Add(col);
            }

            return result;
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

        public void SettingVisibleCol(DataGridView dgv, int strColIndex, bool boolVsbl)
        {
            dgv.Columns[strColIndex].Visible = boolVsbl;
        }

    }
}