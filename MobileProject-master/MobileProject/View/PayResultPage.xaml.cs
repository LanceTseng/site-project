using System.Linq;
using System.Threading;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class PayResultPage : ContentPage
    {
        public PayResultPage()
        {
            InitializeComponent();


            Thread.Sleep(3000);
            var existingPages = Application.Current.MainPage.Navigation.NavigationStack.ToList();
            foreach (var page in existingPages)
            {
                if (page is PayNow || page is CartPage || page is MealPage)
                {
                    Application.Current.MainPage.Navigation.RemovePage(page);
                }
            }
        }
    }
}