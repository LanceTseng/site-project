using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Net.Http;
using System.Threading.Tasks;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Newtonsoft.Json;
using Windows.UI.Core;
using System.Linq;

// The Blank Page item template is documented at https://go.microsoft.com/fwlink/?LinkId=234238

namespace Lab2UwpApp
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class BlankPage1 : Page
    {
        private const string BaseUrl = "https://datastax-api.onrender.com/";

        private readonly HttpClient httpClient;

        public BlankPage1()
        {
            this.InitializeComponent();
            httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(BaseUrl);
        }

        private async void Button_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                string responseData = await GetDataFromService();
                var resp = JsonConvert.DeserializeObject<MenuResponse>(responseData);

                // Update UI on the UI thread
                List<Menu> menuList = resp.Data.Values.ToList();


                // Bind the collection to the GridView
                dtCustomer.ItemsSource = menuList;
            }
            catch (Exception exception)
            {
                MessageDialog mg = new MessageDialog(exception.Message);
                mg.ShowAsync();
            }
        }
        public async Task<string> GetDataFromService()
        {
            HttpResponseMessage response = await httpClient.GetAsync("/menu");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        }
       
    }

    public class Menu
    {
        public string Image { get; set; }
        public int Mid { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
    }

    public class MenuResponse
    {
        public Dictionary<string, Menu> Data { get; set; }
    }
}