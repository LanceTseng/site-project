using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using MobileProject.Model;
using MobileProject.Service;
using MobileProject.Service.Interface;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class ProductMgmtViewModel : BaseViewModel
    {
        private readonly IProductService _productService;

        private string _productName;//condition

        public string ProductName
        {
            get => _productName;
            set
            {
                _productName = value;
                SetProperty(ref _productName, value);
            }
        }

        private ObservableCollection<ProductMgmt> _tableData;

        public ObservableCollection<ProductMgmt> TableData
        {
            get => _tableData;
            set
            {
                _tableData = value;
                SetProperty(ref _tableData, value);
            }
        }

        public ICommand SaveCommand { get; }
        public ICommand AddCommand { get; }
        public ICommand RemoveCommand { get; }
        public ICommand EditCommand { get; }
        public ICommand QueryCommand { get; }
        public ICommand SelectedAllCommand { get; }

        public ProductMgmtViewModel(IProductService productService)
        {
            _productService = productService;

            SaveCommand = new Command(async () => await OnSave());
            AddCommand = new Command(OnAdd);
            RemoveCommand = new Command(async () => await OnRemove());
            EditCommand = new Command<ProductMgmt>(OnEdit);
            QueryCommand = new Command(async () => await OnQuery());
            SelectedAllCommand = new Command(OnSelectedAll);

            _ = LoadData();
        }

        private async Task LoadData()
        {
            var products = await _productService.GetAllProductsAsync();
            if (products != null)
            {
                TableData = new ObservableCollection<ProductMgmt>(products.Select(u => new ProductMgmt(u)));
                OnPropertyChanged(nameof(TableData));
            }
        }

        private async Task OnSave()
        {
            try
            {
                var selectedProduct = TableData.Where(x => x.IsSelected == true).ToList();

                foreach (var product in selectedProduct)
                {
                    var productModel = new Product()
                    {
                        Id = product.Product.Id,
                        Name = product.Product.Name,
                        Description = product.Product.Description,
                        Image = product.Product.Image,
                        Price = product.Product.Price,
                        Date = DateTime.Today
                    };

                    if (product.Product.Id == -1)
                        await _productService.CreateProductAsync(productModel);
                    else
                        await _productService.UpdateProductAsync(productModel);
                }

                await Application.Current.MainPage.DisplayAlert("Info", "Changes saved.", "OK");
                await LoadData();
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Error", ex.Message, "OK");
            }
        }

        private void OnAdd()
        {
            var newProduct = new ProductMgmt(new Product()
            {
                Id = -1,
                Date = DateTime.Now,
                Image = "default1.png"
            })
            {
                IsEnabled = true,
                IsSelected = true
            };
            TableData.Add(newProduct);
        }

        private void OnEdit(ProductMgmt product)
        {
            if (product != null)
            {
                product.IsEnabled = true;
                product.IsSelected = true;
            }
        }

        private async Task OnRemove()
        {
            var selectedProduct = TableData.Where(x => x.IsSelected).ToList();

            foreach (var product in selectedProduct)
            {
                await _productService.DeleteProductAsync(product.Product.Id);
            }
            await Application.Current.MainPage.DisplayAlert("Info", "Product removed.", "OK");
            await LoadData();
        }

        private async Task OnQuery()
        {
            var products = await _productService.GetProductsByConditionAsync(productName: ProductName);
            if (products != null)
            {
                TableData = new ObservableCollection<ProductMgmt>(products.Select(u => new ProductMgmt(u)));
            }
            else
            {
                TableData.Clear();
            }

            OnPropertyChanged(nameof(TableData));
        }

        private void OnSelectedAll()
        {
            foreach (var product in TableData)
            {
                product.IsSelected = !product.IsSelected;
            }
        }
    }
}