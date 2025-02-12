import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as UserApi from "./services/userServices.js";
import * as EmployeeApi from "./services/employeeServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

// Load User List
async function loadUsers() {
  let tbody = $("#userList");
  tbody.empty();

  const users = await UserEmployeeViewApi.getAllUserEmployees();

  $.each(users, function (index, user) {
    let row = `
            <tr>
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td data-id="${user.role_id}">${user.user_role}</td>
                <td>${user.u_is_active ? "Yes" : "No"}</td>
                <td>${formatDate(user.u_created_date)}</td>
                <td>${formatDate(user.u_updated_date)}</td>
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
async function loadEmployee(userId) {
  const emp = await UserEmployeeViewApi.getUserEmployeeByUserId(userId);
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
async function saveEmployee() {
  let empId = $("#employeeId").val();
  let empIndex = employees.findIndex((emp) => emp.employee_id == empId);

  const empExisted = await EmployeeApi.getTaskById(empId);

  const emp = {
    employee_id: empId,
    first_name: $("#firstName").val(),
    last_name: $("#lastName").val(),
    department_id: $("#departmentId").val(),
    status: $("#status").val(),
    address: $("#address").val(),
    phone: $("#phone").val(),
    is_active: $("#isActive").val(),
  };

  Object.assign(empExisted, emp);

  await EmployeeApi.updateTask(empId, emp);
}

// Search Users
async function searchUsers() {
  let searchValue = $("#searchUser").val().trim().toLowerCase();
  let tbody = $("#userList");
  tbody.empty();

  try {
    // Fetch users from API
    const users = await UserEmployeeViewApi.getUserEmployeeByUsername(
      searchValue
    );

    // Iterate through filtered users and append rows to the table
    $.each(users, async function (index, user) {
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
            }">
              Edit
            </button>
          </td>
        </tr>
      `;
      tbody.append(row);
    });

    // If no users found, show a message
    if (filteredUsers.length === 0) {
      tbody.append(
        '<tr><td colspan="7" class="text-center">No users found</td></tr>'
      );
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    tbody.append(
      '<tr><td colspan="7" class="text-center text-danger">Error loading users</td></tr>'
    );
  }
}
// Event Listeners
$(document).ready(async function () {
  await loadUsers();

  // Search Users
  $("#searchBtn").on("click", searchUsers);

  // Load Employee Details on User Edit Click
  $(document).on("click", ".edit-user", async function () {
    let userId = $(this).data("userid");
    await loadEmployee(userId);
  });

  // Save Employee
  $("#saveEmployee").on("click", saveEmployee);
});
