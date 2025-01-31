using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using MobileProject.Helpers;
using MobileProject.Model;
using MobileProject.Repository;
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
            this.Title = "Pay Now";
        }
    }
}