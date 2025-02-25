$(document).ready(function () {
    loginUser();

    loadOrders();
});

function loginUser() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        window.location.href = "/home"; // Redirect
    }
}


const apiBaseUrl = "/api/Orders";
let gridApi = null;

// ✅ Load Orders
function loadOrders() {
    axios.get(`${apiBaseUrl}/GetAllOrdersView`)
        .then(response => setupGrid(response.data))
        .catch(error => console.error("Error loading orders:", error));
}

// ✅ Setup AG Grid
function setupGrid(orders) {
    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: "id", headerName: "ID", width: 70 },
        { field: "transactionCode", headerName: "Transaction Code" },
        { field: "userName", headerName: "User Name" },
        {
            field: "subtotal",
            headerName: "Subtotal",
            valueFormatter: params => `$${params.value.toFixed(2)}`
        },
        {
            field: "date",
            headerName: "Date",
            valueFormatter: params => new Date(params.value).toLocaleDateString()
        },
        { field: "status", headerName: "Status" },
        {
            headerName: "Actions",
            width: 350,
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <button class="btn btn-sm btn-primary me-2" onclick="editOrder(${params.data.id})">✏ Edit</button>
                    <button class="btn btn-sm btn-info" onclick="viewOrderDetail('${params.data.transactionCode}')">📜 View</button>
                `;
                return div;
            }
        }
    ];

    const gridDiv = document.getElementById("orderGrid");
    if (!gridDiv) {
        console.error("Grid container not found");
        return;
    }
    gridDiv.innerHTML = "";
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: orders,
        rowSelection: "multiple",
        pagination: true,
        paginationPageSize: 30,
        domLayout: "normal"
    };
   
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
    gridDiv.style.height = "500px";  // ✅ Set fixed height
}

// ✅ Search Orders
function searchOrders() {
    if (!gridApi) return;

    const filters = {
        transactionCode: $("#searchTransactionCode").val().toLowerCase(),
        userName: $("#searchUserName").val().toLowerCase(),
        status: $("#searchStatus").val().toLowerCase(),
        dateFrom: $("#searchDateFrom").val(),
        dateTo: $("#searchDateTo").val()
    };

    var query = `?userName=${filters.userName}&transactionCode=${filters.transactionCode}&status=${filters.status}`;
    if (filters.dateFrom)
        query += `&dateFrom=${filters.dateFrom}`;
    if (filters.dateTo)
        query += `&dateTo=${filters.dateTo}`;

    axios.get(`${apiBaseUrl}/GetOrderViewByCondition${query}`)
        .then(response => setupGrid(response.data))
        .catch(error => console.error("Error searching orders:", error));
}

function resetFilters() {
    $("#searchTransactionCode, #searchUserName, #searchStatus, #searchDateFrom, #searchDateTo").val("");
    searchOrders();
}

// ✅ Edit Order
function editOrder(transactionCode) {
    axios.get(`${apiBaseUrl}/GetOrderViewByCondition?transactionCode=${transactionCode}`)
        .then(response => openOrderModal(response.data[0]))
        .catch(error => console.error("Error fetching order:", error));
}

// ✅ Open Order Modal (Add/Edit)
function openOrderModal(orderData = null) {
    $("#orderModal").modal("show");

    if (orderData) {
        $("#orderId").val(orderData.id);
        $("#orderTransactionCode").val(orderData.transactionCode);
        $("#orderSubtotal").val(orderData.subtotal);
        $("#orderDate").val(orderData.date);
        $("#orderUserId").val(orderData.userId);
        $("#orderStatus").val(orderData.status);
    } else {
        $("#orderForm")[0].reset();
    }
}

// ✅ Handle Form Submission (Add / Edit)
$("#orderForm").on("submit", async function (event) {
    event.preventDefault();
    const id = $("#orderId").val();

    const orderData = {
        transactionCode: $("#orderTransactionCode").val(),
        subtotal: parseFloat($("#orderSubtotal").val()),
        date: $("#orderDate").val(),
        userId: $("#orderUserId").val(),
        status: $("#orderStatus").val(),
    };

    try {
        orderData.id = id;
        await axios.put(`${apiBaseUrl}/UpdateOrder`, orderData);

        Swal.fire({
            title: "Success!",
            text: "Order saved successfully",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });

        closeOrderModal();
        loadOrders();
    } catch (error) {
        console.error("Error saving order:", error);
    }
});

async function viewOrderDetail(transactionCode) {
    try {
        const response = await axios.get(`/api/CartRecords/GetCartRecordViewByCondition?transactionCode=${transactionCode}`);
        const details = response.data;

        // Clear existing table rows
        $("#orderDetailTable").empty();

        // Populate table with new data
        details.forEach((record) => {
            $("#orderDetailTable").append(`
                <tr>
                    <td hidden>${record.id}</td>
                    <td hidden>${record.username}</td>
                    <td>${record.productName}</td>
                    <td>$${record.price.toFixed(2)}</td>
                    <td>${record.qty}</td>
                    <td>$${record.total.toFixed(2)}</td>
                </tr>
            `);
        });

        // Show the modal
        $("#orderDetailModal").modal("show");
    } catch (error) {
        console.error("Error fetching order details:", error);
        Swal.fire("Error", "Failed to load order details!", "error");
    }
}

// Function to close the order details modal
function closeOrderDetailModal() {
    $("#orderDetailModal").modal("hide");
}

// ✅ Delete Order
function deleteOrder(orderId) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    axios.delete(`${apiBaseUrl}/DeleteOrder/${orderId}`)
        .then(() => loadOrders())
        .catch(error => console.error("Error deleting order:", error));
}

// ✅ Close Modal
function closeOrderModal() {
    $("#orderModal").modal("hide");
}
function toggleSelectAll() {
    if (!gridApi) return;

    const allSelected = gridApi.getSelectedRows().length > 0;
    gridApi.forEachNode(node => node.setSelected(!allSelected));
}