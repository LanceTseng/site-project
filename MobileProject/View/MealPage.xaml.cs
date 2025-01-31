using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Repository;
using MobileProject.ViewModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class MealPage : ContentPage
    {
        //private ProductRepository _productRepository;
        //private CartRecordRepository _cartRecordRepository;

        public MealPage()
        {
            InitializeComponent();
            BindingContext = new MealPageViewModel();
            //LoadView();
        }

    }
}