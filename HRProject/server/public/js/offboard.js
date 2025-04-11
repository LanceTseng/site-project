/**
 * @file offboard.js
 * @description Manages employee offboarding processes, including loading
 *              and displaying employees, and initiating the offboarding workflow.
 */

import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskViewApi from "./services/chilsTaskViewServices.js";
import * as UserApi from "./services/userServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import * as EmployeeViewApi from "./services/employeeViewService.js";
import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

// --- Constants ---
const OFFBOARDING_TASK_GROUP_NAME = "offboard";
const ONBOARDING_STATUS = 2; // Offboarding status ID
const PENDING_STATUS_NAME = "pending";
const NORMAL_STATUS_NAME = "normal";

// --- DOM Element Caching ---
const domElements = {
  searchInput: "#searchInput",
  employeeTableBody: "#employeeTableBody",
  offboardModal: "#offboardModal",
  employeeNameSpan: "#employeeName",
  employeeIdInput: "#employeeId",
  offboardDateInput: "#offboardDate",
  confirmOffboardBtn: "#confirmOffboard",
};

// --- Global Variables ---
let employees = []; // Store loaded employees

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
 * @function loadEmployee
 * @description Loads and displays employees in the table.
 */
async function loadEmployee() {
  try {
    const response = await UserEmployeeViewApi.getAllUserEmployees();
    employees = response.filter((x) => [2, 3].includes(Number(x.status))); // Filter by status 2 and 3

    if (!employees || employees.length === 0) {
      $(domElements.employeeTableBody).html(
        `<tr><td colspan="6" class="text-center">No employees found.</td></tr>`
      );
      return;
    }

    // Define status badge classes
    const statusClasses = {
      onboarding: "bg-success text-white",
      pending: "bg-info text-white",
      offboarding: "bg-danger text-white",
    };

    const employeeTableBody = $(domElements.employeeTableBody);
    employeeTableBody.empty(); // Clear existing rows

    employees.forEach((employee) => {
      const badgeClass =
        statusClasses[employee.status_name?.toLowerCase()] ||
        "bg-secondary text-white";
      const isNormal = isEqualIgnoreCase(
        employee.status_name,
        NORMAL_STATUS_NAME
      );
      const btnOffboarding = isNormal
        ? `<button class="btn btn-danger btn-sm btn-offboarding" data-id="${employee.user_id}" data-name="${employee.username}"><i class="fas fa-play"></i></button>`
        : "";

      const row = `
          <tr>
            <td>${employee.user_id || ""}</td>
            <td>${employee.first_name || ""}</td>
            <td>${employee.last_name || ""}</td>
            <td><span class="badge ${badgeClass}">${
        employee.status_name || ""
      }</span></td>
            <td>${employee.department_name || ""}</td>
            <td class="text-center">${btnOffboarding}</td>
          </tr>
        `;
      employeeTableBody.append(row);
    });
  } catch (error) {
    console.error("Error loading employees:", error);
    showError("Failed to load employees.");
    $(domElements.employeeTableBody).html(
      `<tr><td colspan="6" class="text-center">Failed to load employees. Please try again later.</td></tr>`
    );
  }
}

/**
 * @function handleOffboardingProcess
 * @description Initiates the offboarding process for a given user.
 * @param {string} userId - The ID of the user to start offboarding.
 */
async function handleOffboardingProcess(userId) {
  try {
    const taskGroup = (await ObjectTypeApi.getTaskByName("task_group")) || [];
    const offboardGroup = taskGroup.find((o) =>
      isEqualIgnoreCase(o.object_type_item_value, OFFBOARDING_TASK_GROUP_NAME)
    );

    if (!offboardGroup) {
      throw new Error(`TaskGroup '${OFFBOARDING_TASK_GROUP_NAME}' not found.`);
    }

    const parentTasks = await ParentTaskApi.getTaskByGroupId(
      offboardGroup.object_type_item_key
    );

    if (!parentTasks || parentTasks.length === 0) {
      throw new Error("Parent tasks not found.");
    }

    // Use Promise.all to perform all parent task creations concurrently
    await Promise.all(
      parentTasks.map(async (parent) => {
        const childTasks = await ChildTaskViewApi.getChildTaskByParentId(
          parent.task_id
        );

        const countChildTasks = childTasks.filter((t) => t.enabled).length;

        const userParentTask = await UserParentTaskApi.createTask({
          user_id: userId,
          parent_task_id: parent.task_id,
          status: 0,
          count_child_tasks: countChildTasks,
        });

        // Use Promise.all to perform all child task creations concurrently
        await Promise.all(
          childTasks
            .filter((t) => t.enabled)
            .map((child) =>
              UserChildTaskApi.createTask({
                user_parenttask_id: userParentTask.id,
                child_task_id: child.child_task_id,
                status: 0,
                document_id: child.document_id || null,
                document_path: child.document_path || "",
                require_upload: child.require_upload || 0,
                equipment_type_id: child.equipment_type_id || null,
                training_module_id: child.training_module_id || null,
                access_provisioning_id: child.access_provisioning_id || null,
                interview_id: child.interview_id || null,
                survey_id: child.survey_id || null,
                hand_over_id: child.hand_over_id || null,
              })
            )
        );
      })
    );

    const emp = await EmployeeApi.getTaskByUserId(userId);
    emp.status = ONBOARDING_STATUS; //offboarding
    emp.offboard_date = $(domElements.offboardDateInput).val();
    await EmployeeApi.updateTask(emp.employee_id, emp);

    showSuccess(`[${emp.first_name} ${emp.last_name}] start offboarding!`);
    $(domElements.offboardModal).modal("hide");
    await loadEmployee();
  } catch (error) {
    console.error("Error in offboarding process:", error);
    showError("Failed to start the offboarding process.");
  }
}

/**
 * @function filterEmployee
 * @description Filters the employee list based on the search input.
 */
function filterEmployee() {
  const searchTerm = $(domElements.searchInput).val().toLowerCase();
  const employeeTableBody = $(domElements.employeeTableBody);
  employeeTableBody.empty(); // Clear existing rows

  // Define status badge classes
  const statusClasses = {
    onboarding: "bg-success text-white",
    pending: "bg-info text-white",
    offboarding: "bg-danger text-white",
  };

  employees
    .filter(
      (employee) =>
        employee.first_name?.toLowerCase().includes(searchTerm) ||
        employee.last_name?.toLowerCase().includes(searchTerm)
    )
    .forEach((employee) => {
      const badgeClass =
        statusClasses[employee.status_name?.toLowerCase()] ||
        "bg-secondary text-white";
      const isNormal = isEqualIgnoreCase(
        employee.status_name,
        NORMAL_STATUS_NAME
      );
      const btnOffboarding = isNormal
        ? `<button class="btn btn-danger btn-sm btn-offboarding" data-id="${employee.user_id}" data-name="${employee.username}"><i class="fas fa-sign-out-alt me-1"></i> Start Offboard</button>`
        : "";

      const row = `
          <tr>
            <td>${employee.user_id || ""}</td>
            <td>${employee.first_name || ""}</td>
            <td>${employee.last_name || ""}</td>
            <td><span class="badge ${badgeClass}">${
        employee.status_name || ""
      }</span></td>
            <td>${employee.department_name || ""}</td>
            <td class="text-center">${btnOffboarding}</td>
          </tr>
        `;
      employeeTableBody.append(row);
    });
}

/**
 * @function setupEventListeners
 * @description Sets up event listeners for various actions.
 */
function setupEventListeners() {
  $(document).on("click", ".btn-offboarding", function (e) {
    e.preventDefault();
    const employeeName = $(this).data("name");
    const userId = $(this).data("id");

    $(domElements.employeeNameSpan).text(employeeName);
    $(domElements.employeeIdInput).val(userId);

    // Set default offboard date to today
    const today = new Date().toISOString().split("T")[0];
    $(domElements.offboardDateInput).val(today);

    $(domElements.offboardModal).modal("show");
  });

  $(domElements.confirmOffboardBtn).on("click", (e) => {
    e.preventDefault();
    const userId = $(domElements.employeeIdInput).val();
    handleOffboardingProcess(userId);
  });

  $(domElements.searchInput).on("keyup", filterEmployee);
}

/**
 * @function initializePage
 * @description Initializes the page by loading employee data and setting up event listeners.
 */
async function initializePage() {
  try {
    await loadEmployee();
    setupEventListeners();
  } catch (error) {
    console.error("Page initialization error:", error);
    showError("Failed to initialize the page.");
  }
}

// --- Document Ready ---
$(document).ready(initializePage);
