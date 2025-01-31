using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows.Input;
using MobileProject.Model;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace MobileProject.View.AdminView
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class TableCrudPage : ContentPage
    {
        public ObservableCollection<TableItem> TableData { get; set; }
        public ICommand QueryCommand { get; set; }
        public ICommand DeleteCommand { get; set; }

        public TableCrudPage()
        {
            InitializeComponent();

            TableData = new ObservableCollection<TableItem>
            {
                new TableItem { DisplayText = "Sample Row 1" },
                new TableItem { DisplayText = "Sample Row 2" }
            };

            QueryCommand = new Command(() => QueryData());
            DeleteCommand = new Command(() => DeleteSelected());

            BindingContext = this;
        }

        private void QueryData()
        {
            // Query logic based on ConditionEntry.Text
            DisplayAlert("Query", "Query button clicked.", "OK");
        }

        private void DeleteSelected()
        {
            var itemsToDelete = TableData.Where(item => item.IsSelected).ToList();
            foreach (var item in itemsToDelete)
                TableData.Remove(item);
        }

        private void OnSaveClick(object sender, EventArgs e)
        {
            var obj = (ToolbarItem)sender;
            DisplayAlert("Click",
                $"Click {obj.Text}",
                "OK");
        }

        // Add a new customer to the Customers collection
        private void OnAddClick(object sender, EventArgs e)
        {
            var obj = (ToolbarItem)sender;
             DisplayAlert("Click",
                $"Click {obj.Text}",
                "OK");
        }

        // Remove the current customer
        // If it exist in the database, it will be removed
        // from there too
        private void OnRemoveClick(object sender, EventArgs e)
        {
            var itemsToDelete = TableData.Where(item => item.IsSelected).ToList();
            foreach (var item in itemsToDelete)
                TableData.Remove(item);
        }

        // Remove all customers
        // Use a DisplayAlert object to ask the user's confirmation
        private async void OnRemoveAllClick(object sender, EventArgs e)
        {
            var obj = (ToolbarItem)sender;
            await DisplayAlert("Click",
                $"Click {obj.Text}",
                "OK");
        }
    }

    public class TableItem
    {
        public string DisplayText { get; set; }
        public bool IsSelected { get; set; }
    }
}