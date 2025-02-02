using MobileProject.Service;
using MobileProject.Service.Interface;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View.AdminView
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class OrderMgmtPage : ContentPage
    {
        public OrderMgmtPage()
        {
            InitializeComponent();
            var apiService = App.ServiceProvider.GetService<ApiService>();
            var productService = App.ServiceProvider.GetService<IProductService>();
            var userService = App.ServiceProvider.GetService<IUserService>();
            var orderService = App.ServiceProvider.GetService<IOrderService>();
            var cartRecordService = App.ServiceProvider.GetService<ICartRecordService>();

            this.BindingContext = new OrderMgmtViewModel(apiService, userService, productService, cartRecordService, orderService);
        }
    }
}