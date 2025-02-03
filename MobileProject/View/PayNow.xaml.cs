using MobileProject.Service;
using MobileProject.Service.Interface;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class PayNow : ContentPage
    {
        public PayNow()
        {
            InitializeComponent();
            var apiService = App.ServiceProvider.GetService<ApiService>();
            var orderService = App.ServiceProvider.GetService<IOrderService>();
            var cartRecordService = App.ServiceProvider.GetService<ICartRecordService>();
            this.BindingContext = new PayNowViewModel(apiService, orderService, cartRecordService);
        }
    }
}