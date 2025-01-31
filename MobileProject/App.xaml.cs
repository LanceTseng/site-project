using System;
using System.Threading.Tasks;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.View;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject
{
    public partial class App : Application
    {
        public App()
        {
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
