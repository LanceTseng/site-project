using System;
using System.Threading;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Media.Imaging;
using Windows.UI.Xaml.Media;
using System.Threading.Tasks;


// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Lab2UwpApp
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class BlankPage3 : Page
    {
        public BlankPage3()
        {
            this.InitializeComponent();
        }

        private void btnProcess_Click(object sender, RoutedEventArgs e)
        {
            txtMsg.Text = string.Empty;
            txtResult.Text = string.Empty;

            var btn = sender as Button;

            var tag = btn.Tag.ToString();

            var input1 = IsNumber(txtNum1.Text, out decimal num1);
            var input2 = IsNumber(txtNum2.Text, out decimal num2);

            if (!input1)
            {
                ShowImageDialogAsync();
                txtMsg.Text = "Number 1 is not number";
                return;
            }

            if (!input2)
            {
                ShowImageDialogAsync();
                txtMsg.Text = "Number 2 is not number";
                return;
            }

            if (num2 == 0 && tag.Equals("/"))
            {
                ShowImageDialogAsync();
                txtMsg.Text = "Number 2 can not input zero";
                return;
            }

            try
            {
                Calculate(tag, num1, num2, out decimal result);

                txtResult.Text = result.ToString();

                txtMsg.Text = "Success";
            }
            catch (Exception exception)
            {
                txtMsg.Text = exception.Message;
            }
        }

        public bool Calculate(string operation, decimal num1, decimal num2, out decimal result)
        {
            result = 0;

            switch (operation)
            {
                case "+":
                    result = num1 + num2;
                    break;

                case "-":
                    result = num1 - num2;
                    break;

                case "*":
                    result = num1 * num2;
                    break;

                case "/":
                    result = num1 / num2;
                    break;
            }

            return true;
        }

        public bool IsNumber(string s, out decimal num)
        {
            num = 0;
            try
            {
                if (s.Contains(","))
                    return false;

                var result = decimal.TryParse(s, out num);

                return result;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        private  void ShowImageDialogAsync()
        {
            // Create the Image control.
            Image image = new Image
            {
                Source = new BitmapImage(new Uri("ms-appx:///Assets/error.jpg")),
                Stretch = Stretch.Uniform,
                HorizontalAlignment = HorizontalAlignment.Center
            };

            // Create a ContentDialog to contain the Image control.
            ContentDialog dialog = new ContentDialog
            {
                Content = image,
                Title = "Image Dialog",
                PrimaryButtonText = "OK"
            };

            // Show the dialog.
            dialog.ShowAsync();

            // Create a timer to close the dialog after 3 seconds.
            DispatcherTimer timer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(500) };
            timer.Tick += (s, e) =>
            {
                dialog.Hide();
                timer.Stop();
            };
            timer.Start();
        }
    }
}