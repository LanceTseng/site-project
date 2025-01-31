using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MobileProject.View.AdminView;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class AdminMenu : ContentPage
    {
        public ObservableCollection<MenuItem> MenuItems { get; set; }
        public AdminMenu()
        {
            InitializeComponent();
            MenuItems = new ObservableCollection<MenuItem>
            {
                new MenuItem { Name = "User",  TargetPage = typeof(UserMgmtPage) },
                new MenuItem { Name = "Product", TargetPage = typeof(ProductMgmtPage) },
                new MenuItem { Name = "Order", TargetPage = typeof(OrderMgmtPage) },
                new MenuItem { Name = "Report", TargetPage = typeof(OverviewReportPage) },
                new MenuItem { Name = "Admin Operation", TargetPage = typeof(AdminOperationPage) }

            };

            BindingContext = this;
        }

        private async void OnMenuItemTapped(object sender, ItemTappedEventArgs e)
        {
            if (e.Item is MenuItem item)
            {
                var page = (Page)Activator.CreateInstance(item.TargetPage);
                await Navigation.PushAsync(page);
            }
        }
    }

    public class MenuItem
    {
        public string Name { get; set; }
        public Type TargetPage { get; set; }
    }
}