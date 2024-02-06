using System;
using System.Collections.Generic;
using System.Data;
using System.Windows.Controls;
using System.Windows.Media;
using Assignment1.Attributes;

namespace Assignment1
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
        public void SaveControlsToDic(object control)
        {
            if (control is RadioButton)
            {
                var ctrl = (Control)control;
                OriginalDic.Add(ctrl, ctrl.Name);
            }
            else if (control is StackPanel)
            {
                foreach (object controlChild in (control as StackPanel).Children)
                {
                    SaveControlsToDic(controlChild);
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

                if (radioButton.IsChecked == true)
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
                    radioButton.IsEnabled = false;
                    radioButton.Foreground = Brushes.LightSlateGray;
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
                    radioButton.IsChecked = true;
                    return;
                }

                radioButton.IsChecked = false;
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
    }
}