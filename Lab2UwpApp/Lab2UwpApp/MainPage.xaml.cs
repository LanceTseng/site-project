using System;
using Windows.UI;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace Lab2UwpApp
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        private int ansNum = 0;

        public MainPage()
        {
            this.InitializeComponent();

            ansNum = SetTheNumber();
        }
        private void btnGuess_Click(object sender, RoutedEventArgs e)
        {
            if (CheckName())
            {
                MessageDialog dg = new MessageDialog("Please input name");
                dg.ShowAsync();
                return;
            }

            if (!IsNumber(txtNum.Text))
            {
                MessageDialog dg = new MessageDialog("Please input number");
                dg.ShowAsync();
                return;
            }

            var inputNum = Convert.ToInt32(txtNum.Text);

            lblAns.Text = string.Empty;

            ShowResult(Check(inputNum, ansNum));
        }
        private void btnShowNum_Click(object sender, RoutedEventArgs e)
        {
            ShowAns(ansNum);
        }
        private void btnLeave_Click(object sender, RoutedEventArgs e)
        {
            Leave();
        }
        private void btnChangeColor_Click(object sender, RoutedEventArgs e)
        {
            canvasMain.Background = new SolidColorBrush(Color.FromArgb(255, 48, 179, 221));
        }

        

        private int SetTheNumber()
        {
            return new Random().Next(1, 10);
        }

        private bool Check(int input, int ans)
        {
            return input == ans;
        }

        private void ShowAns(int ans)
        {
            lblAns.Text = ans.ToString();
        }

        private void ShowResult(bool result)
        {
            if (result)
                lblAns.Text = ansNum.ToString();
            else
                lblAns.Text = "X";
        }

        private void Leave()
        {
            MessageDialog dgv = new MessageDialog($"{txtName.Text} bye.");
            dgv.ShowAsync();
            //txtNum.Text = txtName.Text = lblAns.Text = string.Empty;
        }

        private bool CheckName()
        {
            return string.IsNullOrEmpty(txtName.Text);
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
    }
}