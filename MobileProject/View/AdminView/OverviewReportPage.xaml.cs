 
using MobileProject.Service;
using MobileProject.Service.Interface;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View.AdminView
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class OverviewReportPage : ContentPage
    {
        public OverviewReportPage()
        {
            InitializeComponent();
            // Ensure the service is properly resolved from the ServiceProvider
            var overviewReportService = App.ServiceProvider.GetService<IOverviewReportService>();

            // Set the BindingContext with the view model
            this.BindingContext = new OverviewReportPageViewModel( overviewReportService);

        }
    }
}