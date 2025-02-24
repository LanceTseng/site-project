$(document).ready(function () {
    loginUser();

    loadData();

    $("#applyFilters").click(function () {
        searchGrid();
    });
});

function loginUser() {
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        window.location.href = "/home"; // Redirect
    }
}

let gridApi = null;

// Fetch Data and Update UI
function loadData() {
    axios.get('/api/OverviewReport/GetAllOverviewReport')
        .then(response => {
            let data = response.data;
            setupGrid(data);
            updateCharts(data);
        })
        .catch(error => {
            console.error("Error loading data:", error);
        });
}

function searchGrid() {
    let filters = {
        startDate: $("#startDate").val(),
        endDate: $("#endDate").val(),
        user: $("#userFilter").val(),
        role: $("#roleFilter").val(),
    };

    var queryString = `?userName=${filters.user}&role=${filters.role}`;

    if (filters.dateFrom)
        query += `&dateFrom=${filters.startDate}`;
    if (filters.dateTo)
        query += `&dateTo=${filters.endDate}`;

    axios.get(`/api/OverviewReport/GetOverviewReportByCondition${queryString}`)
        .then(response => {
            let data = response.data;
            setupGrid(data);
            updateCharts(data);// ✅ First-time setup
        })
        .catch(error => console.error("Error loading users:", error));
}

function setupGrid(orders) {
    const columnDefs = [
        { field: "userName", headerName: "User Nane" },
        { field: "role", headerName: "Role" },
        { field: "transactionCode", headerName: "Transaction Code" },
        { field: "productName", headerName: "Product Name" },
        { field: "quantity", headerName: "Qty" },
        {
            field: "totalPrice",
            headerName: "Total",
        },
        {
            field: "subtotal",
            headerName: "Subtotal",
        },
        {
            field: "orderDate",
            headerName: "Date"
        },
        { field: "orderStatus", headerName: "Order Status" },

    ];

    const gridDiv = document.getElementById("reportGrid");
    if (!gridDiv) {
        console.error("Grid container not found");
        return;
    }

    gridDiv.innerHTML = "";
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: orders,
        pagination: true,
        paginationPageSize: 30,
        domLayout: "normal"
    };

    gridApi = agGrid.createGrid(gridDiv, gridOptions);
    gridDiv.style.height = "500px";  // ✅ Set fixed height
}
// Update Charts
function updateCharts(data) {
    const productSales = {};
    const productQuantities = {};

    data.forEach(item => {
        productSales[item.productName] = (productSales[item.productName] || 0) + item.totalPrice;
        productQuantities[item.productName] = (productQuantities[item.productName] || 0) + item.quantity;
    });

    createBarChart(productSales);
    createPieChart(productQuantities);
}

function createBarChart(data) {
    let ctx = document.getElementById("barChart").getContext("2d");
    if (window.barChartInstance) {
        window.barChartInstance.destroy();
    }
    window.barChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: "#68B9C0",
                label: "Total Sales"
            }]
        },
        options: { responsive: true }
    });
}

function createPieChart(data) {
    let ctx = document.getElementById("pieChart").getContext("2d");
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }
    window.pieChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(data),
            datasets: [{
                data: Object.values(data),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }]
        },
        options: { responsive: true }
    });
}