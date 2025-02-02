using System;
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


namespace MobileProject
{
    public partial class App : Application
    {
        public static IServiceProvider ServiceProvider { get; private set; }
        public App()
        {

            var services = new ServiceCollection();
            services.AddSingleton<IUserService, UserService>(); // Register service
            ServiceProvider = services.BuildServiceProvider();

            InitializeComponent();
            Task.Run(() => SecureStorageHelper.ClearUserSessionAllAsync());
            MainPage = new NavigationPage(new HomePage()); ;
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
