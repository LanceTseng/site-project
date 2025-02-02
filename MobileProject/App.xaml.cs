using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Service.Interface;
using MobileProject.Service;
using MobileProject.View;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;
using System.Reflection;

namespace MobileProject
{
    public partial class App : Application
    {
        public static IServiceProvider ServiceProvider { get; private set; }

        public App()
        {
            try
            {
                var services = new ServiceCollection();
                services.AddSingleton<ApiService>();
                services.AddSingleton<IUserService, UserService>(); // Ensure correct registration
                services.AddSingleton<IProductService, ProductService>(); // Ensure correct registration
                services.AddSingleton<ICartRecordService, CartRecordService>(); // Ensure correct registration
                ServiceProvider = services.BuildServiceProvider();

                InitializeComponent();

                // Ensure async method does not run in the constructor directly
                Task.Run(async () => await SecureStorageHelper.ClearUserSessionAllAsync());

                MainPage = new NavigationPage(new HomePage());
            }
            catch (TargetInvocationException ex)
            {
                // Inspect the inner exception
                Debug.WriteLine($"Error: {ex.InnerException?.Message}");
            }
        }

        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
}