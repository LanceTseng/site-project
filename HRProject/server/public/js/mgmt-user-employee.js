import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as UserApi from "./services/userServices.js";
import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import { formatDate } from "./utils/stringUtils.js"; // Removed isEqualIgnoreCase if not used

// --- DOM Element References ---
const userListBody = $("#userList");
const detailsForm = $("#detailsForm");
const formContent = $("#formContent");
const selectUserPrompt = $("#selectUserPrompt");
const detailsPanelHeader = $("#detailsPanelHeader");
const saveDetailsBtn = $("#saveDetailsBtn");
const clearFormBtn = $("#clearFormBtn");
const addNewUserBtn = $("#addNewUserBtn");
const resetPasswordBtn = $("#resetPasswordBtn");
const searchBtn = $("#searchBtn");
const searchInput = $("#searchUser");
const userListFooter = $("#userListFooter");

// --- Helper Functions ---

// Generic error handler (optional)
function handleError(error, context) {
  console.error(`${context}:`, error);
  const message =
    error.response?.data?.message || `An error occurred during ${context}.`;
  Swal.fire("Error", message, "error");
}

// Populate Dropdowns
async function populateDropdown(
  dropdownId,
  taskName,
  defaultOptionText = "Select an option"
) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];
    // Add a default, disabled, selected option first
    let options = `<option value="" disabled selected>${defaultOptionText}</option>`;
    options += items
      .map(
        (item) =>
          `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
      )
      .join("");
    $(dropdownId).html(options);
  } catch (error) {
    handleError(error, `populating ${taskName} dropdown`);
    // Provide a fallback message in the dropdown
    $(dropdownId).html(
      `<option value="" disabled selected>Error loading options</option>`
    );
  }
}

// Show/Hide Form Panel
function showForm(mode = "edit", username = "") {
  selectUserPrompt.hide();
  formContent.show();
  if (mode === "add") {
    detailsPanelHeader.text("Add New User/Employee");
    saveDetailsBtn.html('<i class="fas fa-plus"></i> Create User');
    $("#detailUsername").prop("readonly", false).focus(); // Allow editing username and focus
    resetPasswordBtn.hide();
  } else {
    detailsPanelHeader.text(`Details for: ${username}`);
    saveDetailsBtn.html('<i class="fas fa-save"></i> Save Changes');
    $("#detailUsername").prop("readonly", true);
    resetPasswordBtn.show(); // Show only for existing users
  }
}

// Hide Form Panel and Show Prompt
function hideForm() {
  formContent.hide();
  selectUserPrompt.show();
  detailsPanelHeader.text("User & Employee Details");
  userListBody.find("tr").removeClass("table-active"); // Deselect row
  $("#selectedUserId").val("");
  $("#selectedEmployeeId").val("");
  detailsForm[0].reset(); // Also reset the form visually when hiding
}

// Reset/Clear the Details Form (for Add New)
function clearDetailsForm() {
  detailsForm[0].reset(); // Reset native form elements
  $("#selectedUserId").val("");
  $("#selectedEmployeeId").val("");
  // Explicitly set dropdowns back to their placeholder state if reset() doesn't cover it
  $("#detailRole").val("");
  $("#detailDepartment").val("");
  $("#detailEmploymentStatus").val("");
  $("#detailUserActive").val("true"); // Default new user account to active
  showForm("add"); // Set state for adding
}

// Populate the consolidated form
function populateForm(data) {
  // Assume 'data' contains combined user and employee info from an API
  // Example: data = { user: {...}, employee: {...} } or flat structure
  // Adjust access based on your actual API response structure
  // --- Assuming a combined flat structure from UserEmployeeViewApi ---
  // Or adjust if you get separate user/employee objects
  const userId = data.user_id;
  const employeeId = data.employee_id; // Might be null if no employee record yet
  const username = data.username;

  $("#selectedUserId").val(userId || "");
  $("#selectedEmployeeId").val(employeeId || "");

  // User Details
  $("#detailUsername").val(username || "");
  $("#detailRole").val(data.role_id || "");
  $("#detailUserActive").val(String(data.u_is_active).toLowerCase()); // API returns u_is_active

  // Employee Details
  $("#detailFirstName").val(data.first_name || "");
  $("#detailLastName").val(data.last_name || "");
  $("#detailDepartment").val(
    data.department_id != null ? String(data.department_id) : ""
  );
  $("#detailEmploymentStatus").val(
    data.status != null ? String(data.status) : ""
  ); // API returns status
  $("#detailAddress").val(data.address || "");
  $("#detailPhone").val(data.phone || "");
  // Note: Removed the employee-specific 'isActive' field from the form, using only 'detailUserActive'

  showForm("edit", username);
}

// --- Data Loading and Rendering ---

// Render User List Table Rows
function renderUserList(users) {
  userListBody.empty();
  if (!users || users.length === 0) {
    userListBody.append(
      '<tr><td colspan="6" class="text-center text-muted">No users found.</td></tr>'
    ); // Adjusted colspan
    userListFooter.text("No users found.");
    return;
  }

  $.each(users, function (index, user) {
    // Ensure consistent boolean check for u_is_active
    const isActive =
      user.u_is_active === true ||
      user.u_is_active === 1 ||
      String(user.u_is_active).toLowerCase() === "true";
    let row = `
            <tr data-userid="${user.user_id}">
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td data-roleid="${user.role_id}">${
      user.user_role || "N/A"
    }</td>
                <td>${
                  isActive
                    ? '<span class="badge badge-success">Yes</span>'
                    : '<span class="badge badge-danger">No</span>'
                }</td>
                <td>${formatDate(user.u_created_date)}</td>
                <td>${formatDate(
                  user.u_updated_date || user.u_last_updated_date
                )}</td>
                 <!-- Removed Edit button column -->
            </tr>
        `;
    userListBody.append(row);
  });
  userListFooter.text(`${users.length} user(s) found.`);
}

// Load Initial User List or All Users
async function loadUsers(searchTerm = null) {
  hideForm(); // Reset details panel when loading/reloading list
  userListBody.html(
    '<tr><td colspan="6" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading users...</td></tr>'
  ); // Adjusted colspan
  userListFooter.text("Loading...");
  try {
    let users;
    if (searchTerm) {
      users = await UserEmployeeViewApi.getUserEmployeeByUsername(searchTerm);
    } else {
      users = await UserEmployeeViewApi.getAllUserEmployees();
    }
    renderUserList(users);
  } catch (error) {
    handleError(error, "loading users");
    userListBody.html(
      '<tr><td colspan="6" class="text-center text-danger">Error loading users.</td></tr>'
    ); // Adjusted colspan
    userListFooter.text("Error loading.");
  }
}

// Load Specific User Details into Form
async function loadUserDetails(userId) {
  detailsForm[0].reset(); // Clear form before loading new data
  formContent.hide(); // Hide while loading
  selectUserPrompt
    .show()
    .html('<i class="fas fa-spinner fa-spin"></i> Loading details...');

  try {
    // *** IMPORTANT: Use an endpoint that returns combined user/employee data if possible ***
    const userData = await UserEmployeeViewApi.getUserEmployeeByUserId(userId); // Adjust API call if needed

    // If no combined endpoint, fetch separately:
    // const user = await UserApi.getTaskById(userId);
    // let employee = null;
    // try { employee = await EmployeeApi.getTaskByUserId(userId); } catch (e) { /* Ignore if employee not found */ }
    // const userData = { ...user, ...employee, user_id: user.user_id /* ensure primary ID is correct */ };

    if (!userData) {
      throw new Error("User data not found.");
    }
    populateForm(userData);
    selectUserPrompt.html("Select a user from the list..."); // Reset prompt text
  } catch (error) {
    handleError(error, `loading details for user ID ${userId}`);
    hideForm(); // Hide form on error
    selectUserPrompt.html(
      '<span class="text-danger">Error loading details.</span>'
    );
  }
}

// --- Form Submission and Actions ---

// Handle Form Submit (Create or Update)
async function handleFormSubmit(event) {
  event.preventDefault();
  const userId = $("#selectedUserId").val();
  const isUpdating = !!userId;

  // --- Prepare combined data payload ---
  // Adjust structure based on backend expectations (flat or nested)
  const formData = {
    // User Data
    username: isUpdating ? undefined : $("#detailUsername").val(), // Only send username on create
    role_id: $("#detailRole").val(),
    is_active: $("#detailUserActive").val() === "true",

    // Employee Data (Send even if creating user, backend should handle creating linked employee)
    employee_id: $("#selectedEmployeeId").val() || null, // Pass existing employee ID if updating
    first_name: $("#detailFirstName").val(),
    last_name: $("#detailLastName").val(),
    department_id: $("#detailDepartment").val(),
    status: $("#detailEmploymentStatus").val(),
    address: $("#detailAddress").val(),
    phone: $("#detailPhone").val(),
    // Add user_id relation explicitly if backend needs it for employee creation/update
    // user_id: userId // Might be needed if Employee API requires it explicitly
  };

  // Basic Validation Example (expand as needed)
  if (!isUpdating && !formData.username) {
    Swal.fire(
      "Validation Error",
      "Username is required for new users.",
      "warning"
    );
    $("#detailUsername").focus();
    return;
  }
  if (!formData.role_id) {
    Swal.fire("Validation Error", "User Role is required.", "warning");
    $("#detailRole").focus();
    return;
  }
  if (!formData.first_name || !formData.last_name) {
    Swal.fire(
      "Validation Error",
      "First and Last Name are required.",
      "warning"
    );
    $("#detailFirstName").focus();
    return;
  }
  if (!formData.department_id) {
    Swal.fire("Validation Error", "Department is required.", "warning");
    $("#detailDepartment").focus();
    return;
  }
  if (!formData.status) {
    Swal.fire("Validation Error", "Employment Status is required.", "warning");
    $("#detailEmploymentStatus").focus();
    return;
  }

  console.log("Submitting data:", formData);
  console.log("Mode:", isUpdating ? "Update" : "Create");
  saveDetailsBtn
    .prop("disabled", true)
    .html('<i class="fas fa-spinner fa-spin"></i> Saving...');

  try {
    let response;
    if (isUpdating) {
      await UserApi.updateTask(userId, {
        role_id: formData.role_id,
        is_active: formData.is_active,
      });
      if (formData.employee_id) {
        // Update existing employee
        await EmployeeApi.updateTask(formData.employee_id, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          department_id: formData.department_id,
          status: formData.status,
          address: formData.address,
          phone: formData.phone,
          is_active: formData.is_active,
          link_user_id: userId, // Ensure the employee is linked to the correct user
          onboard_date: formData.onboard_date || null, // Optional field
          offboard_date: formData.offboard_date || null, // Optional field
        });
      } else {
        // Create new employee linked to user
        await EmployeeApi.createTask({
          first_name: formData.first_name,
          last_name: formData.last_name,
          department_id: formData.department_id,
          status: formData.status,
          address: formData.address,
          phone: formData.phone,
          is_active: formData.is_active,
          link_user_id: userId, // Link the new employee to the created user
          onboard_date: formData.onboard_date || null, // Optional field
          offboard_date: formData.offboard_date || null, // Optional field
        });
      }
    } else {
      // Use combined create endpoint if available
      // response = await UserEmployeeViewApi.createUserEmployee(formData); // Preferred: Combined API
      const newUser = await UserApi.createTask({
        username: formData.username,
        password: formData.username,
        role_id: formData.role_id,
        is_active: formData.is_active,
      });
      await EmployeeApi.createTask({
        first_name: formData.first_name,
        last_name: formData.last_name,
        department_id: formData.department_id,
        status: formData.status,
        address: formData.address,
        phone: formData.phone,
        is_active: formData.is_active,
        link_user_id: newUser.user_id, // Link the new employee to the created user
        onboard_date: formData.onboard_date || null, // Optional field
        offboard_date: formData.offboard_date || null, // Optional field
      });
    }

    Swal.fire(
      "Success",
      `User ${isUpdating ? "updated" : "created"} successfully!`,
      "success"
    );
    await loadUsers(searchInput.val().trim() || null); // Refresh list (respecting current search)
    hideForm(); // Hide form after success
  } catch (error) {
    handleError(error, `saving user ${isUpdating ? "(update)" : "(create)"}`);
  } finally {
    saveDetailsBtn
      .prop("disabled", false)
      .html(
        isUpdating
          ? '<i class="fas fa-save"></i> Save Changes'
          : '<i class="fas fa-plus"></i> Create User'
      );
  }
}

// Handle Password Reset Request
async function handlePasswordReset() {
  const userId = $("#selectedUserId").val();
  const username = $("#detailUsername").val();
  if (!userId) return;

  const result = await Swal.fire({
    title: `Reset password for ${username}?`,
    text: "This action cannot be undone easily and may trigger an email.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33", // Red for warning
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, reset it!",
  });

  if (result.isConfirmed) {
    console.log(`Initiating password reset for User ID: ${userId}`);
    try {
      // --- API call to your password reset endpoint ---
      // Example: await UserApi.resetPassword(userId);
      Swal.fire(
        "Success",
        "Password reset request initiated successfully.",
        "success"
      );
    } catch (error) {
      handleError(error, "resetting password");
    }
  }
}

// --- Event Listeners ---
$(document).ready(async function () {
  // Initial Load
  await loadUsers();

  // Populate static dropdowns
  await populateDropdown("#detailRole", "user_role", "Select a Role");
  await populateDropdown(
    "#detailDepartment",
    "department",
    "Select a Department"
  );
  await populateDropdown(
    "#detailEmploymentStatus",
    "employee_status",
    "Select Employment Status"
  );

  // Hide form initially
  hideForm();

  // Search Trigger
  searchBtn.on("click", function () {
    loadUsers(searchInput.val().trim() || null); // Pass null to load all if empty
  });
  searchInput.on("keypress", function (e) {
    // Allow searching on Enter key
    if (e.which === 13) {
      // Enter key code
      loadUsers(searchInput.val().trim() || null);
    }
  });

  // Select User from List
  userListBody.on("click", "tr", function () {
    const userId = $(this).data("userid");
    if (userId) {
      // Highlight row
      userListBody.find("tr").removeClass("table-active");
      $(this).addClass("table-active");
      // Load details
      loadUserDetails(userId);
    }
  });

  // Add New User Button
  addNewUserBtn.on("click", clearDetailsForm);

  // Clear/Cancel Button in Form
  clearFormBtn.on("click", function () {
    // If editing (userId is set), just hide form & deselect row
    // If adding (no userId), it should already be cleared, just hide
    hideForm();
  });

  // Form Submission (Create/Update)
  detailsForm.on("submit", handleFormSubmit);

  // Password Reset Button
  resetPasswordBtn.on("click", handlePasswordReset);
});
