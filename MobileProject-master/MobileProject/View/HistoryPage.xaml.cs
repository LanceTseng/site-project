using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Repository;
using MobileProject.Service.Interface;
using MobileProject.Service;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class HistoryPage : ContentPage
    {
        public HistoryPage()
        {
            InitializeComponent();

            var productService = App.ServiceProvider.GetService<IProductService>();
            var orderService = App.ServiceProvider.GetService<IOrderService>();
            var cartRecordService = App.ServiceProvider.GetService<ICartRecordService>();

            this.BindingContext = new HistoryPageViewModel( productService, cartRecordService, orderService);
        }
    }
}