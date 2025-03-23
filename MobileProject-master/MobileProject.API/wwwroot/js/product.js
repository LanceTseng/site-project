$(document).ready(function () {
    loginUser();

    loadProducts();

    // Submit Form Event
    $("#productForm").submit(addProduct);
});

function loginUser() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        window.location.href = "/home"; // Redirect
    }
}

// ✅ API Base URL (Define Only Once)
const apiBaseUrl = "/api/Products";
let gridApi = null;

// 🔹 Load Products into AG Grid
function loadProducts() {
    axios.get(`${apiBaseUrl}/GetAllProducts`)
        .then(response => setupGrid(response.data))
        .catch(error => console.error("Error loading products:", error));
}

// 🔹 Initialize AG Grid
function setupGrid(products) {
    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Name" },
        { field: "description", headerName: "Description" },
        { field: "price", headerName: "Price", valueFormatter: params => `$${params.value.toFixed(2)}` },
        { field: "date", headerName: "Date Added", valueFormatter: params => formatDate_YYYYMMDD(params.value) },
        {
            field: "image",
            headerName: "Image",
            hide: true,
            cellRenderer: params => params.value ? `<img src="${params.value}" width="50" height="50"/>` : "No Image"
        },
        {
            headerName: "Actions",
            field: "actions",
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <button class="btn btn-sm btn-primary me-2 edit-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                `;
                div.querySelector(".edit-btn").addEventListener("click", () => editProduct(params.data.id));
                div.querySelector(".delete-btn").addEventListener("click", () => deleteProduct(params.data.id));
                return div;
            }
        }
    ];

    const gridDiv = document.getElementById("productGrid");
    if (!gridDiv) {
        console.error("Grid container not found");
        return;
    }
    gridDiv.innerHTML = "";

    // ✅ Store gridOptions globally
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: products,
        rowSelection: "multiple",
        pagination: true,
        paginationPageSize: 30,
        domLayout: "normal",
    };

    gridApi = agGrid.createGrid(gridDiv, gridOptions);
    gridDiv.style.height = "500px";  // ✅ Set fixed height
}

function searchGrid() {
    if (!gridApi) return;

    const filters = {
        productName: $("#searchName").val().toLowerCase(),
        maxPrice: $("#searchMaxPrice").val(),
        minPrice: $("#searchMinPrice").val(),
    };

    var queryString = `?productName=${filters.productName}&maxPrice=${filters.maxPrice}&minPrice=${filters.minPrice}`;
    axios.get(`${apiBaseUrl}/GetProductsByCondition/${queryString}`)
        .then(response => {
            setupGrid(response.data);  // ✅ First-time setup
        })
        .catch(error => {
            setupGrid([]);
            console.error("Error loading products:", error)
        })
}
function resetFilters() {
    $("#searchName, #searchMinPrice, #searchMaxPrice, #searchDate").val("");
    searchGrid();
}
// 🔹 Open Modal for Create/Edit Product
function openModal(product = null) {
    $("#productModal").modal("show");
    if (product) {
        $("#productId").val(product.id);
        $("#productName").val(product.name);
        $("#productDescription").val(product.description);
        $("#productPrice").val(product.price);
        $("#productDate").val(formatDate_YYYYMMDD(product.date));
        $("#productImage").val(product.image);
    } else {
        $("#productForm")[0].reset();
        $("#productId").val("");
    }
}

// 🔹 Close Modal
function closeModal() {
    $("#productModal").modal("hide");
}

// 🔹 Add or Update Product
function addProduct(event) {
    event.preventDefault();

    const id = $("#productId").val();
    const product = {
        id: id || null,
        name: $("#productName").val(),
        description: $("#productDescription").val(),
        price: parseFloat($("#productPrice").val()) || 0,
        date: $("#productDate").val() || new Date().toISOString(),
        image: "default1.png"
    };

    if (!id) delete product.id;

    const request = id
        ? axios.put(`${apiBaseUrl}/UpdateProduct`, product)
        : axios.post(`${apiBaseUrl}/CreateProduct`, product);

    request
        .then(() => {
            Swal.fire({
                title: "Success!",
                text: id ? "Product updated successfully" : "Product created successfully",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            closeModal();
            loadProducts();  // ✅ Refresh grid after action
        })
        .catch(error => {
            console.error("Error saving product:", error);
            Swal.fire({ title: "Error!", text: error.message, icon: "error" });
        });
}

// 🔹 Edit Product
function editProduct(id) {
    axios.get(`${apiBaseUrl}/GetProductById/${id}`)
        .then(response => openModal(response.data))
        .catch(error => console.error("Error fetching product:", error));
}

// 🔹 Delete Single Product
function deleteProduct(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then(result => {
        if (result.isConfirmed) {
            axios.delete(`${apiBaseUrl}/DeleteProduct/${id}`)
                .then(() => {
                    Swal.fire("Deleted!", "Product has been deleted.", "success");
                    loadProducts();
                })
                .catch(error => {
                    console.error("Error deleting product:", error);
                    Swal.fire("Error!", "Failed to delete product.", "error");
                });
        }
    });
}

// 🔹 Batch Delete Selected Products
function deleteSelectedProducts() {
    if (!gridApi) return;

    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
        Swal.fire({ title: "No products selected!", text: "Please select products to delete.", icon: "warning" });
        return;
    }

    Swal.fire({
        title: `Delete ${selectedRows.length} products?`,
        text: "This action is irreversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete them!"
    }).then(result => {
        if (result.isConfirmed) {
            Promise.all(selectedRows.map(row => axios.delete(`${apiBaseUrl}/DeleteProduct/${row.id}`)))
                .then(() => {
                    Swal.fire("Deleted!", "Selected products have been deleted.", "success");
                    loadProducts();
                })
                .catch(error => {
                    console.error("Error deleting products:", error);
                    Swal.fire("Error!", "Failed to delete products.", "error");
                });
        }
    });
}

// 🔹 Select All / Unselect All
function toggleSelectAll() {
    if (!gridApi) return;

    const allSelected = gridApi.getSelectedRows().length > 0;
    gridApi.forEachNode(node => node.setSelected(!allSelected));
}

function formatDate_YYYYMMDD(date) {
    if (!date) return "";

    // Convert Date object to YYYY-MM-DD format
    const d = new Date(date);
    if (isNaN(d.getTime())) return ""; // Handle invalid dates

    return d.toISOString().split("T")[0];
}