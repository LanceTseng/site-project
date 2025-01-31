using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using MobileProject.Model;
using MobileProject.Repository;
using Newtonsoft.Json;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using static System.Net.WebRequestMethods;
using Button = Xamarin.Forms.Button;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class AdminOperationPage : ContentPage
    {
        private CartRecordRepository _cartRecordRepository;
        private OrderRepository _orderRepository;
        private UserRepository _userRepository;
        private ProductRepository _productRepository;
        private ReportRepository _reportRepository;

        public AdminOperationPage()
        {
            InitializeComponent();
            _cartRecordRepository = new CartRecordRepository();
            _orderRepository = new OrderRepository();
            _userRepository = new UserRepository();
            _productRepository = new ProductRepository();
            _reportRepository = new ReportRepository();

            cartCurrentRecord.Text = _cartRecordRepository.GetCount().ToString();
            orderCurrentRecord.Text = _orderRepository.GetCount().ToString();
            userCurrentRecord.Text = _userRepository.GetCount().ToString();
            productCurrentRecord.Text = _productRepository.GetCount().ToString();
        }

        private static string xamarinLocalHost = "10.0.2.2";
        private static string xamarinPort = "5180";

        private async void btnDelete_All(object sender, EventArgs e)
        {
            if (sender is Button button)
            {
                // Retrieve the identifier (ClassId) of the clicked button
                string buttonId = button.ClassId.ToLower(); // Use ClassId to identify the button

                switch (buttonId)
                {
                    //case "cart":
                    //    var resultCart = _cartRecordRepository.DeleteCartAll();
                    //    DisplayAlert("Action", $"Deleting {resultCart} records from Order", "OK");
                    //    cartCurrentRecord.Text = _cartRecordRepository.GetCount().ToString();
                    //    break;

                    //case "order":
                    //    // Handle delete all for Order
                    //    var resultOrder = _orderRepository.DeleteOrderAll();
                    //    await DisplayAlert("Action", $"Deleting {resultOrder} records from Order", "OK");
                    //    orderCurrentRecord.Text = _orderRepository.GetCount().ToString();
                    //    break;

                    //case "user":
                    //    // Handle delete all for Order
                    //    var resultUser = _userRepository.DeleteUserAll();
                    //    await DisplayAlert("Action", $"Deleting {resultUser} records from Order", "OK");
                    //    userCurrentRecord.Text = _orderRepository.GetCount().ToString();
                    //    break;

                    //case "product":
                    //    // Handle delete all for Order
                    //    var resultProduct = _productRepository.DeleteProductAll();
                    //    await DisplayAlert("Action", $"Deleting {resultProduct} records from Order", "OK");
                    //    productCurrentRecord.Text = _orderRepository.GetCount().ToString();
                    //    break;

                    case "updateorder":
                        ApiCallingTest();
                        break;

                    default:
                        await DisplayAlert("Error", "Unknown action", "OK");
                        break;
                }
            }
        }


        private readonly HttpClient _httpClient = new HttpClient();
        private const string Url = "http://10.0.2.2:5180/WeatherForecast";
        private async void ApiCallingTest()
        {
            try
            {
                string response = await _httpClient.GetStringAsync(Url);

                Debug.WriteLine( JsonConvert.DeserializeObject(response));
            }
            catch (Exception ex){
            
                // Handle exceptions (e.g., network issues)
                Debug.WriteLine($"Exception: {ex.Message}");
            }
        }
    }
}