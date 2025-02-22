$(document).ready(function () {
    loadUsers();

    // Submit Form Event
    $("#userForm").submit(addUser);
});

// ✅ API Base URL (Define Only Once)
const apiBaseUrl = "/api/Users";
let gridApi = null;

// 🔹 Load Users into AG Grid
function loadUsers() {
    axios.get(`${apiBaseUrl}/GetAllUsers`)
        .then(response => {
            setupGrid(response.data);  // ✅ First-time setup
        })
        .catch(error => console.error("Error loading users:", error));
}

// 🔹 Initialize AG Grid
function setupGrid(users) {
    const columnDefs = [
        { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
        { field: "id", headerName: "ID", width: 70 },
        { field: "userName", headerName: "Username" },
        { field: "email", headerName: "Email" },
        { field: "phone", headerName: "Phone" },
        { field: "role", headerName: "Role" },
        { field: "createdDate", headerName: "Created Date" },
        {
            headerName: "Actions",
            field: "actions",
            cellRenderer: params => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <button class="btn btn-sm btn-primary me-2 edit-btn">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                `;
                div.querySelector(".edit-btn").addEventListener("click", () => editUser(params.data.id));
                div.querySelector(".delete-btn").addEventListener("click", () => deleteUser(params.data.id));
                return div;
            }
        }
    ];

    // ✅ Get the plain DOM element instead of a jQuery object
    const gridDiv = document.getElementById("userGrid");
    if (!gridDiv) {
        console.error("Grid container not found");
        return;
    }

    gridDiv.innerHTML = "";
    // ✅ Store gridOptions globally
    const gridOptions = {
        columnDefs: columnDefs,
        rowData: users,
        rowSelection: "multiple",
        pagination: true,
        paginationPageSize: 30,
        domLayout: "normal"
    };

    gridApi = agGrid.createGrid(gridDiv, gridOptions);
    gridDiv.style.height = "500px";  // ✅ Set fixed height
}

// 🔹 Search Function for AG Grid
function searchGrid() {
    if (!gridApi) return;

    const filters = {
        userName: $("#searchUsername").val().toLowerCase(),
        email: $("#searchEmail").val().toLowerCase(),
        phone: $("#searchPhone").val().toLowerCase(),
        role: $("#searchRole").val().toLowerCase()
    };

    var queryString = `?userName=${filters.userName}&password=${filters.password}&email=${filters.email}&phone=${filters.phone}&role=${filters.role}`;
    axios.get(`${apiBaseUrl}/GetUsersByCondition/${queryString}`)
        .then(response => {
            setupGrid(response.data);  // ✅ First-time setup
        })
        .catch(error => console.error("Error loading users:", error));
}

// 🔹 Reset Search Filters
function resetFilters() {
    $("#searchUsername, #searchEmail, #searchPhone, #searchRole").val("");
    searchGrid();
}

// 🔹 Open Modal for Create/Edit User
function openModal(user = null) {
    $("#userModal").modal("show");

    if (user) {
        $("#userId").val(user.id);
        $("#userName").val(user.userName);
        $("#phone").val(user.phone);
        $("#email").val(user.email);
        $("#role").val(user.role);
        $("#createdDate").val(user.createdDate);
        $("#password").val(user.password);
    } else {
        $("#userForm")[0].reset();
        $("#userId").val("");
    }
}

// 🔹 Close Modal
function closeModal() {
    $("#userModal").modal("hide");
}

// 🔹 Add or Update User
function addUser(event) {
    event.preventDefault();

    const id = $("#userId").val();
    const user = {
        id: id || null,
        userName: $("#userName").val(),
        password: $("#password").val(),
        phone: $("#phone").val(),
        email: $("#email").val(),
        role: $("#role").val(),
        createdDate: $("#createdDate").val() || new Date().toISOString()
    };

    if (!id) delete user.id;

    const request = id
        ? axios.put(`${apiBaseUrl}/UpdateUser`, user)
        : axios.post(`${apiBaseUrl}/CreateUser`, user);

    request
        .then(() => {
            Swal.fire({
                title: "Success!",
                text: id ? "User updated successfully" : "User created successfully",
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });
            closeModal();
            loadUsers();  // ✅ Refresh grid after action
        })
        .catch(error => {
            console.error("Error saving user:", error);
            Swal.fire({ title: "Error!", text: error.message, icon: "error" });
        });
}

// 🔹 Edit User
function editUser(id) {
    axios.get(`${apiBaseUrl}/GetUserById/${id}`)
        .then(response => openModal(response.data))
        .catch(error => console.error("Error fetching user:", error));
}

// 🔹 Delete Single User
function deleteUser(id) {
    Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then(result => {
        if (result.isConfirmed) {
            axios.delete(`${apiBaseUrl}/DeleteUser/${id}`)
                .then(() => {
                    Swal.fire("Deleted!", "User has been deleted.", "success");
                    loadUsers();
                })
                .catch(error => {
                    console.error("Error deleting user:", error);
                    Swal.fire("Error!", "Failed to delete user.", "error");
                });
        }
    });
}

// 🔹 Batch Delete Selected Users
function deleteSelectedUsers() {
    if (!gridApi) return;
    console.log(gridApi);

    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
        Swal.fire({ title: "No users selected!", text: "Please select users to delete.", icon: "warning" });
        return;
    }

    Swal.fire({
        title: `Delete ${selectedRows.length} users?`,
        text: "This action is irreversible!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete them!"
    }).then(result => {
        if (result.isConfirmed) {
            Promise.all(selectedRows.map(row => axios.delete(`${apiBaseUrl}/DeleteUser/${row.id}`)))
                .then(() => {
                    Swal.fire("Deleted!", "Selected users have been deleted.", "success");
                    loadUsers();
                })
                .catch(error => {
                    console.error("Error deleting users:", error);
                    Swal.fire("Error!", "Failed to delete users.", "error");
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