using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Windows.Input;
using Microcharts;
using MobileProject.Model;
using MobileProject.Repository;
using SkiaSharp;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class OverviewReportPageViewModel : BaseViewModel
    {
        private ReportRepository _reportRepository;
        private string _username;
        private string _role;
        private string _productName;
        private DateTime? _fromDate = new DateTime(DateTime.Today.Year, DateTime.Today.Month, 1);
        private DateTime? _toDate = DateTime.Today;
        private ObservableCollection<Overview> _reports;

        public string Username
        {
            get => _username;
            set => SetProperty(ref _username, value);
        }

        public ObservableCollection<string> RoleOptions { get; } = new ObservableCollection<string>()
        {
            "",
            "admin",
            "user"
        };

        public string Role
        {
            get => _role;
            set => SetProperty(ref _role, value);
        }

        public string ProductName
        {
            get => _productName;
            set => SetProperty(ref _productName, value);
        }

        public DateTime? FromDate
        {
            get => _fromDate;
            set => SetProperty(ref _fromDate, value);
        }

        public DateTime? ToDate
        {
            get => _toDate;
            set => SetProperty(ref _toDate, value);
        }

        public ObservableCollection<Overview> Reports
        {
            get => _reports;
            set => SetProperty(ref _reports, value);
        }

        //private ObservableCollection<ProductSalesData> _productsSalesData;

        //public ObservableCollection<ProductSalesData> ProductSales
        //{
        //    get => _productsSalesData;
        //    set => SetProperty(ref _productsSalesData, value);
        //}

        //private ObservableCollection<UserSalesData> _userSales;

        //public ObservableCollection<UserSalesData> UserSales
        //{
        //    get => _userSales;
        //    set => SetProperty(ref _userSales, value);
        //}

        public ICommand ProcessReportCommand { get; }

        public OverviewReportPageViewModel()
        {
            Reports = new ObservableCollection<Overview>();
            ProcessReportCommand = new Command(ProcessReport);

            _reportRepository = new ReportRepository();
        }

        private BarChart _productSalesChart;
        private PieChart _productSummary;

        public BarChart ProductSalesChart
        {
            get => _productSalesChart;
            set => SetProperty(ref _productSalesChart, value); // Notifies view of changes
        }

        public PieChart ProductSummaryChart
        {
            get => _productSummary;
            set => SetProperty(ref _productSummary, value);
        }

        private void ProcessReport()
        {
            try
            {
                // Fetch all reports
                var allReports = _reportRepository.GetOverviewReports()?.ToList();

                if (allReports == null || !allReports.Any())
                {
                    Console.WriteLine("No reports found.");
                    Reports.Clear(); // Clear the collection if no results
                    return;
                }

                // Apply filters with null checks
                if (!string.IsNullOrEmpty(Username))
                    allReports = allReports.Where(r => !string.IsNullOrEmpty(r.UserName) &&
                                                       r.UserName.ToLower().Contains(Username.ToLower())).ToList();

                if (!string.IsNullOrEmpty(Role))
                    allReports = allReports.Where(r => !string.IsNullOrEmpty(r.Role) &&
                                                       r.Role.Contains(Role)).ToList();

                if (!string.IsNullOrEmpty(ProductName))
                    allReports = allReports.Where(r => !string.IsNullOrEmpty(r.ProductName) &&
                                                       r.ProductName.ToLower().Contains(ProductName.ToLower()))
                        .ToList();

                if (FromDate.HasValue)
                    allReports = allReports.Where(r => r.OrderDate.Date >= FromDate.Value.Date).ToList();

                if (ToDate.HasValue)
                    allReports = allReports.Where(r => r.OrderDate.Date <= ToDate.Value.Date).ToList();

                // Update the ObservableCollection
                foreach (var report in allReports)
                {
                    _reports.Add(report);
                }

                // Generate ProductSalesData
                GenerateBarChartProductSales(allReports);
                GeneratePieChartProductSummary(allReports);
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error processing report: {ex.Message}");
            }
        }

        private void GenerateBarChartProductSales(List<Overview> reports)
        {
            if (reports == null || !reports.Any())
            {
                ProductSalesChart = new BarChart { Entries = new List<ChartEntry>() };
                return;
            }

            var chartEntries = reports
                .GroupBy(r => r.ProductName)
                .Select(g => new ChartEntry(g.Sum(r => (float)r.TotalPrice))
                {
                    Label = g.Key,
                    ValueLabel = g.Sum(r => (float)r.TotalPrice).ToString("C"),
                    Color = SKColor.Parse("#68B9C0") // Customize color
                })
                .ToList();

            ProductSalesChart = new BarChart
            {
                Entries = chartEntries,
                LabelTextSize = 40,
                BackgroundColor = SKColor.Parse("#FFFFFF"),
                BarAreaAlpha = 128, // Semi-transparent bars for better visibility
                MaxValue = chartEntries.Max(e => float.Parse(e.ValueLabel.Replace("$", ""))) + 10 // Avoid bar cutoff
            };
        }

        private void GeneratePieChartProductSummary(List<Overview> reports)
        {
            if (reports == null || !reports.Any())
            {
                ProductSummaryChart = new PieChart { Entries = new List<ChartEntry>() };
                return;
            }

            // Generate random colors for each product
            Random random = new Random();
            SKColor GetRandomColor() => new SKColor(
                (byte)random.Next(100, 256),
                (byte)random.Next(100, 256),
                (byte)random.Next(100, 256)
            );

            var chartEntries = reports
                .GroupBy(r => r.ProductName)
                .Select(g =>
                {
                    float totalQuantity = g.Sum(r => (float?)r.Quantity ?? 0); // Total quantity of the product
 
                    return new ChartEntry(totalQuantity) // Pie charts need absolute values, not percentages
                    {
                        Label = g.Key,
                        ValueLabel = $"{totalQuantity} pcs",  // Show quantity instead of percentage
                        Color = GetRandomColor(),
                        TextColor = SKColor.Parse("#333333"),
                        // Improve visibility
                    };

                })
                .ToList();

            ProductSummaryChart = new PieChart()
            {
                Entries = chartEntries,
                LabelTextSize = 30, // Increase text size for better visibility
                BackgroundColor = SKColor.Parse("#FFFFFF"),
                GraphPosition = GraphPosition.AutoFill
            };
        }
    }
}