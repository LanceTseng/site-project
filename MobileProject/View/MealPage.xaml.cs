using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Repository;
using MobileProject.Service;
using MobileProject.Service.Interface;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MealPage : ContentPage
    {
        public MealPage()
        {
            InitializeComponent();
            var apiService = App.ServiceProvider.GetService<ApiService>();
            var productService = App.ServiceProvider.GetService<IProductService>();
            var cartRecordService = App.ServiceProvider.GetService<ICartRecordService>();
            this.BindingContext = new MealPageViewModel(apiService, productService, cartRecordService);
        }

    }
}