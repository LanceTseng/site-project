using System;
using MobileProject.Model;
using System.Collections.ObjectModel;
using MobileProject.Repository;
using System.Windows.Input;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using Xamarin.Forms;

namespace MobileProject.ViewModel
{
    public class ProductMgmtViewModel : BaseViewModel
    {
        private ProductRepository _productRepository;

        private string _productName;//condition

        public string ProductName
        {
            get => _productName;
            set
            {
                _productName = value;
                OnPropertyChanged();
            }
        }


        private ObservableCollection<ProductMgmt> _tableData;
        public ObservableCollection<ProductMgmt> TableData
        {
            get => _tableData;
            set
            {
                _tableData = value;
                OnPropertyChanged();
            }
        }

        public ICommand SaveCommand { get; }
        public ICommand AddCommand { get; }
        public ICommand RemoveCommand { get; }
        public ICommand EditCommand { get; }
        public ICommand QueryCommand { get; }
        public ICommand SelectedAllCommand { get; }

        public ProductMgmtViewModel()
        {
            _productRepository = new ProductRepository();

            SaveCommand = new Command(OnSave);
            AddCommand = new Command(OnAdd);
            RemoveCommand = new Command(OnRemove);
            EditCommand = new Command<ProductMgmt>(OnEdit);
            QueryCommand = new Command(OnQuery);
            SelectedAllCommand = new Command(OnSelectedAll);

            TableData = new ObservableCollection<ProductMgmt>();

            LoadData();
        }

        private void LoadData()
        {
            var products = _productRepository.GetFilteredProducts().ToList();
            TableData = new ObservableCollection<ProductMgmt>(products.Select(u => new ProductMgmt(u)));
        }

        private void OnQuery()
        {
            var products = _productRepository.GetFilteredProducts(name:ProductName).ToList();
            TableData = new ObservableCollection<ProductMgmt>(products.Select(u => new ProductMgmt(u)));
        }

        private void OnEdit(ProductMgmt product)
        {
            // Enable editing for the selected product
            if (product != null)
            {
                product.IsEnabled = true;
                product.IsSelected = true;
            }
        }

        private async void OnRemove()
        {
            var selectedProduct = TableData.Where(x => x.IsSelected == true).ToList();

            foreach (var productMgmt in selectedProduct)
            {
                await _productRepository.DeleteAsync(productMgmt.Product.Id);
            }
            await Application.Current.MainPage.DisplayAlert("Info", "Product removed.", "OK");
            LoadData();

        }

        private void OnAdd()
        {
            var newProduct = new ProductMgmt(new Product()
            {
                Id = -1,
                Date = DateTime.Now,
                Image = "default1.png"
            });
            newProduct.IsEnabled = true;
            newProduct.IsSelected = true;
            TableData.Add(newProduct);
        }

        private async void OnSave()
        {
            try
            {
                var selectedProduct = TableData.Where(x => x.IsSelected == true).ToList();

                foreach (var productMgmt in selectedProduct)
                {
                    if (productMgmt.Product.Id == -1)
                    {
                        await _productRepository.InsertAsync(new Product()
                        {
                            Name = productMgmt.Product.Name,
                            Description = productMgmt.Product.Description,
                            Image = productMgmt.Product.Image,
                            Price = productMgmt.Product.Price,
                            Date = DateTime.Today
                        });
                    }
                    else
                    {
                        await _productRepository.UpdateAsync(new Product()
                        {
                            Id = productMgmt.Product.Id,
                            Name = productMgmt.Product.Name,
                            Description = productMgmt.Product.Description,
                            Image = productMgmt.Product.Image,
                            Price = productMgmt.Product.Price,
                            Date = DateTime.Today
                        });
                    }
                }

                await Application.Current.MainPage.DisplayAlert("Info", "Changes saved.", "OK");
                LoadData();
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Error", ex.Message, "OK");
            }
        }

        private void OnSelectedAll()
        {
            foreach (var productMgmt in TableData)
            {
                productMgmt.IsSelected = !productMgmt.IsSelected;
            }
        }
    }
}