using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MobileProject;
using MobileProject.Helpers;
using MobileProject.Model;
using SQLite;
using Xamarin.Essentials;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class HomePage : ContentPage
    {
        public HomePage()
        {
            InitializeComponent();
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();

            string isLoggedInString = await SecureStorageHelper.GetIsLoggedInAsync();
            string username = await SecureStorageHelper.GetUsernameAsync();
            string role = await SecureStorageHelper.GetRoleAsync();
            string userId = await SecureStorageHelper.GetUserIdAsync();

            bool isLoggedIn = Convert.ToBoolean(isLoggedInString);
            bool isAdmin = role == "admin";

            lblLoginInfo.Text = (isLoggedIn) ? $"Hello, {username}({role})." : "Hello, Guest.";

            if (isLoggedIn)
            {
                var existingPages = Application.Current.MainPage.Navigation.NavigationStack.ToList();
                foreach (var page in existingPages)
                {
                    if (page is LoginPage)
                    {
                        Application.Current.MainPage.Navigation.RemovePage(page);
                    }
                }

                btnLogin.IsVisible = !isLoggedIn;
            }

            Auth(isAdmin);

            btnLogout.IsVisible = isLoggedIn;
            btnCart.IsVisible = isLoggedIn;
            btnHistory.IsVisible = isLoggedIn;
        }

        private void Auth(bool isAdmin)
        {
            btnAdmin.IsVisible = isAdmin;
        }

        private async void btnMeals_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new MealPage());
        }

        private async void btnLogin_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new LoginPage());
        }
        private async void btnLogout_Clicked(object sender, EventArgs e)
        {
            IsBusy = true;

            // Clear the session
            await SecureStorageHelper.ClearUserSessionAllAsync();

            await Application.Current.MainPage.DisplayAlert("Logged Out", "You have been logged out.", "OK");

            Application.Current.MainPage = new NavigationPage(new HomePage());

            IsBusy = false;
            
        }

        private async void btnHistory_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new HistoryPage());
        }

        private async void btnCart_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new CartPage());
        }

        private async void btnAdmin_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new AdminMenu());
        }
    }
}