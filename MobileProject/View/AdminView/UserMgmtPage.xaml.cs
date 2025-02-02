
using MobileProject.Service.Interface;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View.AdminView
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class UserMgmtPage : ContentPage
    {

        public UserMgmtPage()
        {
            InitializeComponent();
            this.BindingContext = new UserMgmtViewModel(App.ServiceProvider.GetService<IUserService>());
        }

    }
}