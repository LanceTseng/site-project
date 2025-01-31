using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Repository;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class HistoryPage : ContentPage
    {
        public HistoryPage()
        {
            InitializeComponent();
            this.Title = "History";
        }

    }
}