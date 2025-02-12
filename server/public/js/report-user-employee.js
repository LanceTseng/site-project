let users = [
  {
    user_id: 1,
    username: "admin",
    role_id: 1,
    is_active: 1,
    created_date: "2024-01-01",
    last_updated_date: "2024-02-01",
  },
  {
    user_id: 2,
    username: "john_doe",
    role_id: 2,
    is_active: 0,
    created_date: "2024-01-05",
    last_updated_date: "2024-02-05",
  },
];

let employees = [
  {
    employee_id: 101,
    first_name: "John",
    last_name: "Doe",
    department_id: 1,
    status: 1,
    address: "123 Street",
    phone: "123456789",
    is_active: 1,
    link_user_id: 2,
  },
];

// Load User List
function loadUsers() {
  let tbody = $("#userList");
  tbody.empty();

  $.each(users, function (index, user) {
    let row = `
            <tr>
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>${user.role_id}</td>
                <td>${user.is_active ? "Yes" : "No"}</td>
                <td>${user.created_date}</td>
                <td>${user.last_updated_date}</td>
                <td>
                    <button class="btn btn-info btn-sm edit-user" data-userid="${
                      user.user_id
                    }">Edit</button>
                </td>
            </tr>
        `;
    tbody.append(row);
  });
}

// Load Employee Details
function loadEmployee(userId) {
  let emp = employees.find((emp) => emp.link_user_id === userId);
  if (!emp) return;

  $("#employeeId").val(emp.employee_id);
  $("#firstName").val(emp.first_name);
  $("#lastName").val(emp.last_name);
  $("#departmentId").val(emp.department_id);
  $("#status").val(emp.status);
  $("#address").val(emp.address);
  $("#phone").val(emp.phone);
  $("#isActive").val(emp.is_active);
}

// Save Employee Data
function saveEmployee() {
  let empId = $("#employeeId").val();
  let empIndex = employees.findIndex((emp) => emp.employee_id == empId);
  if (empIndex !== -1) {
    employees[empIndex] = {
      employee_id: empId,
      first_name: $("#firstName").val(),
      last_name: $("#lastName").val(),
      department_id: $("#departmentId").val(),
      status: $("#status").val(),
      address: $("#address").val(),
      phone: $("#phone").val(),
      is_active: $("#isActive").val(),
      link_user_id: employees[empIndex].link_user_id,
    };
    alert("Employee details updated!");
  }
}

// Search Users
function searchUsers() {
  let searchValue = $("#searchUser").val().toLowerCase();
  let tbody = $("#userList");
  tbody.empty();

  $.each(
    users.filter((user) => user.username.toLowerCase().includes(searchValue)),
    function (index, user) {
      let row = `
            <tr>
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>${user.role_id}</td>
                <td>${user.is_active ? "Yes" : "No"}</td>
                <td>${user.created_date}</td>
                <td>${user.last_updated_date}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-user" data-userid="${
                      user.user_id
                    }">Edit</button>
                </td>
            </tr>
        `;
      tbody.append(row);
    }
  );
}

// Event Listeners
$(document).ready(function () {
  loadUsers();

  // Search Users
  $("#searchBtn").on("click", searchUsers);

  // Load Employee Details on User Edit Click
  $(document).on("click", ".edit-user", function () {
    let userId = $(this).data("userid");
    loadEmployee(userId);
  });

  // Save Employee
  $("#saveEmployee").on("click", saveEmployee);
});
