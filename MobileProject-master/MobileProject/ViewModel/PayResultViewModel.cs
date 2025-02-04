using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.View;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class PayResultViewModel
    {
        public ICommand BackToMenuCommand { get; }
        public PayResultViewModel()
        {
            BackToMenuCommand = new Command(async() => await BackToMenuCommandAsync());
        }

        private async Task BackToMenuCommandAsync()
        {
            await Application.Current.MainPage.Navigation.PushAsync(new HomePage());
        }

    }
}
