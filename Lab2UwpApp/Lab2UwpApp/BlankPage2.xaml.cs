using System;
using System.Collections.ObjectModel;
using System.Data.SqlClient;
using System.Diagnostics;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Lab2UwpApp
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class BlankPage2 : Page
    {
        private string connection = (App.Current as App).ConnectionString;

        public BlankPage2()
        {
            this.InitializeComponent();
            userList.ItemsSource = GetUser(connection);
        }

        private void btnSignUp_Click(object sender, RoutedEventArgs e)
        {
            var gender = string.Empty;
                if (rbFemale.IsChecked == true)
            {
                gender = rbFemale.Content.ToString();
            }

            if (rbMale.IsChecked == true)
            {
                gender = rbFemale.Content.ToString();
            }

            var payment = string.Empty;
            if (rbBank.IsChecked == true)
            {
                payment = rbBank.Content.ToString();
            }
            if (rbCard.IsChecked == true)
            {
                payment = rbCard.Content.ToString();
            }
            if (rbPaypal.IsChecked == true)
            {
                payment = rbPaypal.Content.ToString();
            }

            if (string.IsNullOrEmpty(txtUserName.Text))
            {
                var messageDialog = new MessageDialog("Please enter username.");
                messageDialog.ShowAsync();
                return;
            }

            if (string.IsNullOrEmpty(txtPassword.Password))
            {
                var messageDialog = new MessageDialog("Please enter a password.");
                messageDialog.ShowAsync();
                return;
            }
            if (txtPassword.Password.Contains(" "))
            {
                var messageDialog = new MessageDialog("Password can not contain blank.");
                messageDialog.ShowAsync();
                return;
            }

            if (string.IsNullOrEmpty(gender))
            {
                var messageDialog = new MessageDialog("Please enter your Gender.");
                messageDialog.ShowAsync();
                return;
            }

            if (string.IsNullOrEmpty(payment))
            {
                var messageDialog = new MessageDialog("Please Enter a Valid Payment Option.");
                messageDialog.ShowAsync();
                return;
            }

            if (cbTerm.IsChecked != true)
            {
                var messageDialog = new MessageDialog("Please Accept all terms and conditions.");
                messageDialog.ShowAsync();
                return;
            }

            InsertUser(connection, new User()
            {
                Username = txtUserName.Text,
                Password = txtPassword.Password,
                Gender = gender,
                Payment = payment
            });

            var messageDialogSuccess = new MessageDialog("Congratulations!! you have successfully signed up.");
            messageDialogSuccess.ShowAsync();

            userList.ItemsSource = GetUser(connection);
        }

        private void btnReset_Click(object sender, RoutedEventArgs e)
        {
            txtUserName.Text = string.Empty;
            txtPassword.Password = string.Empty;
            rbFemale.IsChecked = false;
            rbMale.IsChecked = false;
            rbCard.IsChecked = false;
            rbBank.IsChecked = false;
            rbPaypal.IsChecked = false;
            cbTerm.IsChecked = false;
        }

        private void btnResetPwd_Click(object sender, RoutedEventArgs e)
        {
            txtPassword.Password = string.Empty;
        }

        private void btnClose_Click(object sender, RoutedEventArgs e)
        {
            Application.Current.Exit();
        }

        public void InsertUser(string connectionString, User user)
        {
            const string InsertCustomerQuery = @"insert into Users (username, password, gender, payment) values (@username, @password, @gender, @payment)";

            try
            {
                using (var conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    if (conn.State == System.Data.ConnectionState.Open)
                    {
                        using (SqlCommand cmd = conn.CreateCommand())
                        {
                            cmd.CommandText = InsertCustomerQuery;
                            cmd.Parameters.AddWithValue("@username", user.Username);
                            cmd.Parameters.AddWithValue("@password", user.Password);
                            cmd.Parameters.AddWithValue("@gender", user.Gender);
                            cmd.Parameters.AddWithValue("@payment", user.Payment);
                            cmd.ExecuteNonQuery();
                        }
                    }
                }
            }
            catch (Exception eSql)
            {
                Debug.WriteLine($"Exception: {eSql.Message}");
            }
        }

        public ObservableCollection<User> GetUser(string connectionString)
        {
            const string GetUserQuery = @"select id, username, password, gender, payment from Users";
            ;
            var users = new ObservableCollection<User>();
            try
            {
                using (var conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    if (conn.State == System.Data.ConnectionState.Open)
                    {
                        using (SqlCommand cmd = conn.CreateCommand())
                        {
                            cmd.CommandText = GetUserQuery;
                            using (SqlDataReader reader = cmd.ExecuteReader())
                            {
                                while (reader.Read())
                                {
                                    var user = new User();
                                    user.Id = reader.GetInt32(0);
                                    user.Username = reader.GetString(1);
                                    user.Password = reader.GetString(2);
                                    user.Gender = reader.GetString(3);
                                    user.Payment = reader.GetString(4);

                                    users.Add(user);
                                }
                            }
                        }
                    }
                }
                return users;
            }
            catch (Exception eSql)
            {
                Debug.WriteLine($"Exception: {eSql.Message}");
            }
            return null;
        }

       
    }
}