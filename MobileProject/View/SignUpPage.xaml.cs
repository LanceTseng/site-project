using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MobileProject.Service;
using MobileProject.Service.Interface;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class SignUpPage : ContentPage
    {
        public SignUpPage()
        {
            InitializeComponent();
            var apiService = App.ServiceProvider.GetService<ApiService>();
            var userService = App.ServiceProvider.GetService<IUserService>();
            this.BindingContext = new SignUpPageViewModel(apiService, userService);
        }
    }
}