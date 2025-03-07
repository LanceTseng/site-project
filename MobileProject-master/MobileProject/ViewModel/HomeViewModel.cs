using System;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class HomeViewModel : BaseViewModel
    {
        private string _currentTime;

        public string CurrentTime
        {
            get => _currentTime;
            set => SetProperty(ref _currentTime, value);

        }

        public HomeViewModel()
        {
            Device.StartTimer(TimeSpan.FromSeconds(1), () =>
            {
                CurrentTime = DateTime.Now.ToString("hh:mm:ss tt"); // 12-hour format
                return true; // Keep the timer running
            });
        }
    }
}