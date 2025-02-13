import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as UserApi from "./services/userServices.js";
import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

async function populateDropdown(dropdownId, taskName) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];
    const options = items
      .map(
        (item) =>
          `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
      )
      .join("");
    $(dropdownId).html(options);
  } catch (error) {
    handleError(error, `Error populating ${taskName} dropdown`);
  }
}

// Load User List
async function loadUsers() {
  let tbody = $("#userList");
  tbody.empty();

  const users = await UserEmployeeViewApi.getAllUserEmployees();

  $.each(users, function (index, user) {
    let row = `
            <tr class="user-row" data-userid="${user.user_id}">
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
  try {
    const emp = await EmployeeApi.getTaskByUserId(userId);
    if (!emp) return;

    $("#employeeId").val(emp.employee_id);
    $("#firstName").val(emp.first_name);
    $("#lastName").val(emp.last_name);
    $("#edit-department").val(emp.department_id);
    $("#edit-status").val(emp.status);
    $("#address").val(emp.address);
    $("#phone").val(emp.phone);
    $("#isActive").val(emp.is_active); // Convert Boolean to String
  } catch (error) {
    console.error("Error loading employee:", error);
  }
}

// Save Employee Data
async function saveEmployee() {
  const empId = $("#employeeId").val();

  const empExisted = await EmployeeApi.getTaskById(empId);

  const emp = {
    employee_id: empId,
    first_name: $("#firstName").val(),
    last_name: $("#lastName").val(),
    department_id: $("#edit-department").val(),
    status: $("#edit-status").val(),
    address: $("#address").val(),
    phone: $("#phone").val(),
    is_active: $("#isActive").val(),
  };

  Object.assign(empExisted, emp);

  try {
    await EmployeeApi.updateTask(empId, emp);
    Swal.fire("Success", "Employee updated successfully!", "success");
  } catch (error) {
    console.error("Error updating employee:", error);
    Swal.fire("Error", "Failed to update Employee!", "error");
  }
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
        <tr class="user-row" data-userid="${user.user_id}">
          <td>${user.user_id}</td>
          <td>${user.username}</td>
          <td data-id="${user.role_id}">${user.user_role}</td>
          <td>${user.u_is_active ? "Yes" : "No"}</td>
          <td>${formatDate(user.u_created_date)}</td>
          <td>${formatDate(user.u_last_updated_date)}</td>
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
    if (users.length === 0) {
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

  await populateDropdown("#edit-status", "employee_status");
  await populateDropdown("#edit-department", "department");
  await populateDropdown("#edit-role", "user_role");

  // Search Users
  $("#searchBtn").on("click", searchUsers);

  // Save Employee
  $("#saveEmployee").on("click", saveEmployee);

  $("#userList").on("click", ".user-row", function () {
    let userId = $(this).data("userid");
    loadEmployee(userId);
  });

  // Load User Data into Modal
  $(document).on("click", ".edit-user", async function () {
    let userId = $(this).data("userid");

    try {
      const user = await UserApi.getTaskById(userId); // Fetch user details

      if (!user) {
        Swal.fire("Error", "User not found!", "error");
        return;
      }

      // Fill modal fields
      $("#editUserId").val(user.user_id);
      $("#editUsername").val(user.username);
      $("#edit-role").val(user.role_id);
      $("#editIsActive").val(user.is_active);

      // Show the modal
      $("#editUserModal").modal("show");
    } catch (error) {
      console.error("Error loading user:", error);
      Swal.fire("Error", "Failed to load user data!", "error");
    }
  });

  // Save User Changes
  $("#saveUserChanges").on("click", async function () {
    let userId = $("#editUserId").val();

    const existUser = await UserApi.getTaskById(userId);

    const updatedUser = {
      role_id: $("#edit-role").val(),
      is_active: $("#editIsActive").val() === "1", // Convert string to boolean
    };

    Object.assign(existUser, updatedUser);
    try {
      await UserApi.updateTask(userId, updatedUser); // API call to update user

      Swal.fire("Success", "User updated successfully!", "success");

      $("#editUserModal").modal("hide"); // Close the modal
      await loadUsers(); // Refresh the user list
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error", "Failed to update user!", "error");
    }
  });
});
