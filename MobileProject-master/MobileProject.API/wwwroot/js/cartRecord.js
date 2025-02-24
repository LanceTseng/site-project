

$(document).ready(function () {

    loginUser();
    loadCartRecords();
});

function loginUser() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        window.location.href = "/home"; // Redirect
    }
}


const apiBaseUrl = "/api/CartRecords";
let gridApi = null;
let selectedCartId = null; // To track edit mode

// ✅ Load Cart Records
function loadCartRecords() {
    axios.get(`${apiBaseUrl}/GetAllCartRecordsView`)
        .then(response => setupGrid(response.data))
        .catch(error => console.error("Error loading records:", error));
}

// ✅ Setup AG Grid
function setupGrid(records) {
    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: "id", headerName: "ID", width: 70 },
        { field: "username", headerName: "User Name" },
        { field: "productName", headerName: "Product Name" },
        {
            field: "price", headerName: "Price", valueFormatter: params => `$${params.value.toFixed(2)}`
        },
        { field: "qty", headerName: "Quantity" },
        { field: "total", headerName: "Total", valueFormatter: params => `$${params.value.toFixed(2)}` },
        { field: "status", headerName: "Status" },
        { field: "transactionCode", headerName: "T-Code" },
        {
            headerName: "Actions",
            width: 350,
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <button class="btn btn-sm btn-primary me-2" onclick="editCart(${params.data.id})">✏ Edit</button>
                    <button class="btn btn-sm btn-danger me-2" onclick="deleteRecord(${params.data.id})">🗑 Delete</button>
                    <button class="btn btn-sm btn-info" onclick="viewOrderDetail('${params.data.transactionCode}')">📜 Order Detail</button>
                `;
                return div;
            }
        }
    ];

    const gridDiv = $("#cartGrid").get(0);
    gridDiv.innerHTML = "";
    gridApi = agGrid.createGrid(gridDiv, {
        columnDefs,
        rowData: records,
        rowSelection: "multiple",
        pagination: true,
        paginationPageSize: 30
    });
}

function searchGrid() {
    if (!gridApi) return;

    const filters = {
        transactionCode: $("#searchTransactionCode").val().toLowerCase(),
        productName: $("#searchProductName").val().toLowerCase(),
        userName: $("#searchUserName").val().toLowerCase(),
        status: $("#searchStatus").val().toLowerCase(),
    };

    var query = `?userName=${filters.userName}&productName=${filters.productName}&status=${filters.status}&transactionCode=${filters.transactionCode}`
    axios.get(`${apiBaseUrl}/GetCartRecordViewByCondition${query}`)
        .then(response => {
            setupGrid(response.data);  // ✅ First-time setup
        })
        .catch(error => console.error("Error loading users:", error));
}

function resetFilters() {
    $("#searchTransactionCode, #searchUserName, #searchStatus").val("");
    searchGrid();
}

function editCart(id) {
    axios.get(`${apiBaseUrl}/GetCartRecordViewByCondition?cartId=${id}`)
        .then(response => openModal(response.data[0]))
        .catch(error => console.error("Error fetching cart record:", error));
}

// ✅ Open Modal (Add/Edit)
function openModal(cartData = null) {
    $("#cartModal").modal("show");

    if (cartData) {
        // Populate form fields for editing
        $("#cartId").val(cartData.id);
        $("#cartQty").val(cartData.qty);
        $("#cartTotal").val(cartData.total);
        $("#cartProductId").val(cartData.productId);
        $("#cartProductName").val(cartData.productName);
        $("#cartUserId").val(cartData.userId);
        $("#cartStatus").val(cartData.status);
        $("#cartProductPrice").val(cartData.price);
    } else {
        $("#cartForm")[0].reset();  // Reset form for Add mode
    }
}
// ✅ Handle Form Submission (Add / Edit)
$("#cartForm").on("submit", async function (event) {
    event.preventDefault();
    const id = $("#cartId").val();
    const cardRecord = await axios.get(`${apiBaseUrl}/GetCartRecordById/${id}`);

    cardRecord.data.qty = $("#cartQty").val();
    cardRecord.data.total = $("#cartTotal").val();

    try {
        await axios.put(`${apiBaseUrl}/UpdateCartRecord`, cardRecord.data);


        if (cardRecord.data.transactionCode) {
            const order = await axios.get(`api/Orders/GetOrdersByCondition?transactionCode=${cardRecord.data.transactionCode}`);

            const cartRecord = await axios.get(`${apiBaseUrl}/GetCartRecordByCondition?transactionCode=${cardRecord.data.transactionCode}`);
            let sum = 0;
            cartRecord.data.forEach(record => {
                sum += record.total;
            });

            order.data[0].subtotal = sum;
    

            await axios.put(`api/Orders/UpdateOrder`, order.data[0]);
        }

        Swal.fire({
            title: "Success!",
            text: "Cart updated successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });

        closeModal();
        loadCartRecords(); // Refresh grid after update
    } catch (error) {
        console.error("Error saving cart record:", error);
    }
});

$("#cartQty").on("change", function () {
    const qty = parseFloat($("#cartQty").val()) || 0;
    const price = parseFloat($("#cartProductPrice").val()) || 0;
    $("#cartTotal").val((qty * price).toFixed(2));
});

// ✅ Delete a Single Record
function deleteRecord(cartId) {
    if (!confirm("Are you sure you want to delete this record?")) return;

    axios.delete(`${apiBaseUrl}/DeleteCartRecord/${cartId}`)
        .then(() => loadCartRecords())
        .catch(error => console.error("Error deleting record:", error));
}

// ✅ Batch Delete Selected Records
function deleteSelectedRecords() {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedIds = selectedNodes.map(node => node.data.id);

    if (selectedIds.length === 0) {
        alert("Please select at least one record to delete.");
        return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedIds.length} records?`)) return;

    axios.post(`${apiBaseUrl}/BatchDeleteCart`, { ids: selectedIds })
        .then(() => loadCartRecords())
        .catch(error => console.error("Error deleting records:", error));
}

// ✅ Select/Unselect All Rows
function toggleSelectAll() {
    if (gridApi.getSelectedRows().length === gridApi.getDisplayedRowCount()) {
        gridApi.deselectAll();
    } else {
        gridApi.selectAll();
    }
}

// ✅ View Order Details
function viewOrderDetail(transactionCode) {
    axios.get(`/api/Orders/GetOrdersByCondition?transactionCode=${transactionCode}`)
        .then(response => {

            // Check if data exists and has at least one record
            if (response.data.length > 0) {
                const order = response.data[0]; // Get the first order

                $("#orderTransactionCode").text(order.transactionCode);
                $("#orderSubtotal").text(order.subtotal.toFixed(2));
                $("#orderDate").text(new Date(order.date).toLocaleDateString());
                $("#orderUserId").text(order.userId);
                $("#orderStatus").text(order.status || "N/A");

                $("#orderModal").modal("show");
            } else {
                console.warn("No order found for the given transaction code.");
                alert("No order details found.");
            }
        })
        .catch(error => console.error("Error fetching order details:", error));
}

// ✅ Close Modals
function closeModal() {
    $("#cartModal").modal("hide");
}

function closeOrderModal() {
    $("#orderModal").modal("hide");
}
