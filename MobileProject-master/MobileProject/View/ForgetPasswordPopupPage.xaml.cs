using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MobileProject.Service.Interface;
using MobileProject.ViewModel;
using Rg.Plugins.Popup.Pages;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class ForgetPasswordPopupPage : PopupPage
    {
		public ForgetPasswordPopupPage ()
		{
			InitializeComponent ();
        }
	}
}