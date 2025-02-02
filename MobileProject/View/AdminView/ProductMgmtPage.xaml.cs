
using MobileProject.Service.Interface;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View.AdminView
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class ProductMgmtPage : ContentPage
    {
        public ProductMgmtPage()
        {
            InitializeComponent();
            this.BindingContext = new ProductMgmtViewModel(App.ServiceProvider.GetService<IProductService>());
        }
    }
}