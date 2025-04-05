/**
 * @file onboard.js
 * @description Manages employee onboarding processes, including form submission,
 *              employee listing, and onboarding initialization.
 */

import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskViewApi from "./services/chilsTaskViewServices.js";
import * as UserApi from "./services/userServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import * as EmployeeViewApi from "./services/employeeViewService.js";
import * as DocumentApi from "./services/documentServices.js";
import { isEqualIgnoreCase } from "./utils/stringUtils.js";

// --- Constants ---
const DEPARTMENT_TASK_NAME = "department";
const EMPLOYEE_STATUS_TASK_NAME = "employee_status";
const ONBOARD_TASK_GROUP_NAME = "onboard";
const ACTIVE_STATUS_ID = "1"; // Assuming "Active" status ID is 1

// --- DOM Element Caching ---
const domElements = {
  employeeForm: "#employee-form",
  firstNameInput: "#first-name",
  lastNameInput: "#last-name",
  departmentSelect: "#department",
  statusSelect: "#status",
  phoneInput: "#phone",
  addressInput: "#address",
  onboardDateInput: "#onboardDate",
  employeeTableBody: "#employee-table-body",
  onboardingAlert: "#onboarding-alert",
  editModal: "#editModal",
  editFirstNameInput: "#edit-first-name",
  editLastNameInput: "#edit-last-name",
  editDepartmentSelect: "#edit-department",
  editStatusSelect: "#edit-status",
  editPhoneInput: "#edit-phone",
  editAddressInput: "#edit-address",
  editEmployeeIdInput: "#edit-employee-id",
  editEmployeeForm: "#edit-employee-form",
};

// --- Utility Functions ---

/**
 * @function showError
 * @description Displays an error message using SweetAlert2.
 * @param {string} message - The error message to display.
 */
function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error!",
    text: message,
  });
}

/**
 * @function showSuccess
 * @description Displays a success message using SweetAlert2.
 * @param {string} message - The success message to display.
 */
function showSuccess(message) {
  Swal.fire({
    icon: "success",
    title: "Success!",
    text: message,
  });
}

/**
 * @function clearAlert
 * @description Hides the alert message after a specified time.
 */
function clearAlert() {
  setTimeout(() => {
    $(domElements.onboardingAlert).hide();
  }, 3000);
}

/**
 * @function populateDropdown
 * @description Populates a select dropdown with data from an API call.
 * @param {string} dropdownId - The ID of the select element.
 * @param {string} taskName - The task name to retrieve from the ObjectTypeApi.
 */
async function populateDropdown(dropdownId, taskName) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];
    let options = `<option value="" disabled selected>Select an option</option>`;

    options += items
      .map(
        (item) =>
          `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
      )
      .join("");

    $(dropdownId).html(options);
  } catch (error) {
    console.error(`Error populating ${taskName} dropdown:`, error);
    showError(`Failed to load ${taskName} options.`);
  }
}

/**
 * @function loadEmployees
 * @description Loads and displays employees in the table.
 */
async function loadEmployees() {
  try {
    const employees = await EmployeeViewApi.getTasks();

    if (!employees || employees.length === 0) {
      $(domElements.employeeTableBody).html(
        `<tr><td colspan="7" class="text-center">No employees found.</td></tr>`
      );
      return;
    }

    const rows = employees
      .map((emp) => {
        return `
          <tr>
            <td>${emp.employee_id || ""}</td>
            <td>${emp.first_name || ""}</td>
            <td>${emp.last_name || ""}</td>
            <td>${emp.department_name || ""}</td>
            <td>${emp.status_name || ""}</td>
            <td hidden>${emp.link_user_id || ""}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-info edit-btn" data-id="${
                emp.employee_id || ""
              }"><i class="fas fa-pencil-alt"></i></button>
              ${
                isEqualIgnoreCase(emp.status_name, "pending")
                  ? `<button class="btn btn-sm btn-success start-onboarding-btn" data-id="${emp.link_user_id}"><i class="fas fa-play"></i></button>`
                  : ""
              }
            </td>
          </tr>
        `;
      })
      .join("");
    $(domElements.employeeTableBody).html(rows);
  } catch (error) {
    console.error("Error loading employees:", error);
    showError("Failed to load employees.");
  }
}

/**
 * @function startOnboardingProcess
 * @description Starts the onboarding process for a given user.
 * @param {string} userId - The ID of the user to start onboarding.
 */
async function startOnboardingProcess(userId) {
  try {
    const taskGroup = (await ObjectTypeApi.getTaskByName("task_group")) || [];
    const onboardGroup = taskGroup.find((o) =>
      isEqualIgnoreCase(o.object_type_item_value, ONBOARD_TASK_GROUP_NAME)
    );

    if (!onboardGroup) {
      throw new Error(`TaskGroup '${ONBOARD_TASK_GROUP_NAME}' not found.`);
    }

    const parentTasks = await ParentTaskApi.getTaskByGroupId(
      onboardGroup.object_type_item_key
    );

    if (!parentTasks || parentTasks.length === 0) {
      throw new Error("Parent tasks not found.");
    }

    for (const parent of parentTasks) {
      const childTasks = await ChildTaskViewApi.getChildTaskByParentId(
        parent.task_id
      );

      const countChildTasks =
        childTasks.filter((t) => Boolean(t.enabled))?.length || 0;

      const userParentTask = await UserParentTaskApi.createTask({
        user_id: userId,
        parent_task_id: parent.task_id,
        status: 0,
        count_child_tasks: countChildTasks,
      });

      await Promise.all(
        childTasks
          .filter((t) => Boolean(t.enabled))
          .map(async (child) => {
            let document = null;

            if (child.document_id) {
              document = await DocumentApi.getTaskById(child.document_id);
              if (!document) throw new Error("Document not found.");
            }

            await UserChildTaskApi.createTask({
              user_parenttask_id: userParentTask.id,
              child_task_id: child.child_task_id,
              status: 0,
              document_id: child.document_id || null,
              document_path: document ? document.document_path : "",
              require_upload: document ? document.require_upload : 0,
              equipment_type_id: child.equipment_type_id || null,
              training_module_id: child.training_module_id || null,
              access_provisioning_id: child.access_provisioning_id || null,
              interview_id: child.interview_id || null,
              survey_id: child.survey_id || null,
              hand_over_id: child.hand_over_id || null,
            });
          })
      );
    }

    const emp = await EmployeeApi.getTaskById(userId);
    emp.status = ACTIVE_STATUS_ID; // onboarding
    await EmployeeApi.updateTask(emp.employee_id, emp);

    $(domElements.onboardingAlert)
      .html(
        `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        Onboarding process has started successfully for ${emp.first_name} ${emp.last_name}.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `
      )
      .show();

    clearAlert();
    await loadEmployees();
  } catch (error) {
    console.error("Error in onboarding process:", error);
    showError("Failed to start the onboarding process.");
  }
}

/**
 * @function validateForm
 * @description Validates the employee form inputs.
 * @returns {boolean} True if all inputs are valid; otherwise, false.
 */
function validateForm() {
  const firstName = $(domElements.firstNameInput).val();
  const lastName = $(domElements.lastNameInput).val();
  const department = $(domElements.departmentSelect).val();
  const onboardDate = $(domElements.onboardDateInput).val();
  const phone = $(domElements.phoneInput).val();
  const address = $(domElements.addressInput).val();

  if (
    !firstName ||
    !lastName ||
    !department ||
    !onboardDate ||
    !phone ||
    !address
  ) {
    showError("Please fill in all required fields.");
    return false;
  }
  return true;
}

/**
 * @function handleEmployeeFormSubmit
 * @description Handles the submission of the employee form.
 * @param {Event} event - The form submission event.
 */
async function handleEmployeeFormSubmit(event) {
  event.preventDefault();

  if (!validateForm()) return;

  try {
    const firstName = $(domElements.firstNameInput).val();
    const lastName = $(domElements.lastNameInput).val();
    const department = $(domElements.departmentSelect).val();
    const username = `${firstName}_${lastName}`.toLowerCase();
    const onboard_date = $(domElements.onboardDateInput).val();
    const phone = $(domElements.phoneInput).val();
    const address = $(domElements.addressInput).val();

    const newUser = await UserApi.createTask({
      username,
      password: username,
      role_id: department,
    });

    await EmployeeApi.createTask({
      first_name: firstName,
      last_name: lastName,
      department_id: department,
      status: 0,
      phone: phone,
      address: address,
      onboard_date: onboard_date,
      is_active: true,
      link_user_id: newUser.user_id,
    });

    showSuccess("Employee added successfully!");
    await loadEmployees();
    $(domElements.employeeForm)[0].reset(); // Reset the form
  } catch (error) {
    console.error("Error adding employee:", error);
    showError("Failed to add employee.");
  }
}

/**
 * @function populateEditModal
 * @description Populates the edit modal with employee data.
 * @param {string} id - The ID of the employee to edit.
 */
async function populateEditModal(id) {
  try {
    const employee = await EmployeeApi.getTaskById(id);

    if (!employee) throw new Error("Employee not found.");

    await populateDropdown(domElements.editDepartmentSelect, "department");
    await populateDropdown(domElements.editStatusSelect, "employee_status");

    $(domElements.editFirstNameInput).val(employee.first_name);
    $(domElements.editLastNameInput).val(employee.last_name);
    $(domElements.editPhoneInput).val(employee.phone);
    $(domElements.editAddressInput).val(employee.address);
    $(domElements.editEmployeeIdInput).val(employee.employee_id);
    $(domElements.editDepartmentSelect).val(employee.department_id);
    $(domElements.editStatusSelect).val(employee.status);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    showError("Failed to fetch employee details for editing.");
  }
}

/**
 * @function handleEditEmployeeFormSubmit
 * @description Handles the submission of the edit employee form.
 * @param {Event} event - The form submission event.
 */
async function handleEditEmployeeFormSubmit(event) {
  event.preventDefault();

  try {
    const id = $(domElements.editEmployeeIdInput).val();
    const employee = await EmployeeApi.getTaskById(id);

    if (!employee) throw new Error("Employee not found.");

    await EmployeeApi.updateTask(id, {
      first_name: $(domElements.editFirstNameInput).val(),
      last_name: $(domElements.editLastNameInput).val(),
      department_id: $(domElements.editDepartmentSelect).val(),
      status: $(domElements.editStatusSelect).val(),
      phone: $(domElements.editPhoneInput).val(),
      address: $(domElements.editAddressInput).val(),
    });

    showSuccess("Employee updated successfully!");
    await loadEmployees();
    $(domElements.editModal).modal("hide");
  } catch (error) {
    console.error("Error updating employee:", error);
    showError("Failed to update employee information.");
  }
}

/**
 * @function setupEventListeners
 * @description Sets up event listeners for various actions.
 */
function setupEventListeners() {
  // Form Submission
  $(domElements.employeeForm).on("submit", handleEmployeeFormSubmit);

  // Start Onboarding Click
  $(domElements.employeeTableBody).on(
    "click",
    ".start-onboarding-btn",
    function () {
      const userId = $(this).data("id");
      startOnboardingProcess(userId);
    }
  );

  // Edit Button Click
  $(domElements.employeeTableBody).on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    populateEditModal(id);
    $(domElements.editModal).modal("show"); // Trigger the modal
  });

  // Edit Form Submission
  $(domElements.editEmployeeForm).on("submit", handleEditEmployeeFormSubmit);
}

/**
 * @function initializePage
 * @description Initializes the page by populating dropdowns and loading employees.
 */
async function initializePage() {
  try {
    await populateDropdown(domElements.departmentSelect, DEPARTMENT_TASK_NAME);
    await populateDropdown(domElements.statusSelect, EMPLOYEE_STATUS_TASK_NAME);
    await loadEmployees();
    setupEventListeners();
  } catch (error) {
    console.error("Page initialization error:", error);
    showError("Failed to initialize the page.");
  }
}

// --- Document Ready ---
$(document).ready(initializePage);
