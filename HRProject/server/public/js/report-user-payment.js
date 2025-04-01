/**
 * @file report-user-payment.js
 * @description Manages employee payment information, including searching, displaying, and editing payments.
 */

import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as UserPaymentApi from "./services/uesrPaymentServices.js";
import { accessVerify } from "./utils/authVerify.js";
import { formatDate } from "./utils/stringUtils.js";

// --- Constants ---
const DEFAULT_PAYMENT_ID = "-1"; // Used for new payments
const PAYMENT_TYPE_TASK_NAME = "payment_type";
const EMPLOYEE_STATUS_TASK_NAME = "employee_status";

// --- DOM Element Caching ---
const domElements = {
  searchForm: "#search-form",
  searchName: "#searchName",
  searchDepartment: "#searchDepartment",
  searchEmpStatus: "#searchEmpStatus",
  btnSearch: "#btnSearch",
  paymentTableBody: "#paymentTableBody",
};

// --- Global Variables ---
let paymentTypes = [];
let departments = [];
let employeeStatuses = [];

// --- Utility Functions ---

/**
 * @function showError
 * @description Displays an error message using SweetAlert2.
 * @param {string} message - The error message to display.
 */
function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
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
    title: "Success",
    text: message,
  });
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
    let options = `<option value="">Select an option</option>`;

    options += items
      .map(
        (item) =>
          `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
      )
      .join("");

    $(dropdownId).html(options);

    // Store the fetched data
    if (taskName === "department") {
      departments = items;
    } else if (taskName === "employee_status") {
      employeeStatuses = items;
    } else if (taskName === "payment_type") {
      paymentTypes = items;
    }
  } catch (error) {
    console.error(`Error populating ${taskName} dropdown:`, error);
    showError(`Failed to load ${taskName} options.`);
  }
}

/**
 * @function createTableRow
 * @description Creates a table row with employee payment data.
 * @param {object} payment - The employee payment data.
 * @returns {string} The HTML for the table row.
 */
function createTableRow(payment) {
  const paymentId = payment.payment_id ?? DEFAULT_PAYMENT_ID;
  const userId = payment.user_id ?? "";
  const paymentTypeName =
    paymentTypes.find(
      (pt) => pt.object_type_item_key === payment.payment_type_id
    )?.object_type_item_value || "N/A";

  return `
    <tr data-id="${paymentId}">
      <td>${payment.user_id || ""}</td>
      <td>${payment.employee_first_name || ""}</td>
      <td>${payment.employee_last_name || ""}</td>
      <td>${payment.employee_status_name || ""}</td>
      <td>
        <select class="form-control payment-type" data-payment-id="${paymentId}" disabled>
          ${paymentTypes
            .map(
              (pt) => `
            <option value="${pt.object_type_item_key}" ${
                pt.object_type_item_key === payment.payment_type_id
                  ? "selected"
                  : ""
              }>${pt.object_type_item_value}</option>
          `
            )
            .join("")}
        </select>
      </td>
      <td><input type="text" class="form-control annual-salary" value="${
        payment.annual_salary || ""
      }" data-payment-id="${paymentId}" disabled></td>
      <td><input type="text" class="form-control weekly-hours" value="${
        payment.weekly_work_hours || ""
      }" data-payment-id="${paymentId}" disabled></td>
      <td><input type="text" class="form-control termination-pay" value="${
        payment.termination_pay || ""
      }" data-payment-id="${paymentId}" disabled></td>
      <td>${formatDate(payment.created_at)}</td>
      <td>${formatDate(payment.updated_at)}</td>
      <td class="text-center">
        <button class="btn btn-secondary btn-sm edit-btn" data-payment-id="${paymentId}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-primary btn-sm save-btn" data-payment-id="${paymentId}" data-user-id="${userId}" disabled>
          <i class="fas fa-save"></i> Save
        </button>
      </td>
    </tr>
  `;
}

/**
 * @function loadEmployeePayment
 * @description Loads employee payment data based on search criteria and displays it in the table.
 */
async function loadEmployeePayment() {
  try {
    const searchName = $(domElements.searchName).val() || "";
    const searchDepartment = $(domElements.searchDepartment).val() || "";
    const searchEmpStatus = $(domElements.searchEmpStatus).val() || "";

    const loadingRow = `
      <tr>
          <td colspan="11" class="text-center">
              <div class="spinner-border" role="status">
                  <span class="sr-only">Loading...</span>
              </div>
              <p>Loading employee payments...</p>
          </td>
      </tr>`;
    $(domElements.paymentTableBody).html(loadingRow);

    const response = await UserPaymentApi.getUserPaymentViewByCondition({
      name: searchName,
      department: searchDepartment,
      status: searchEmpStatus,
    });

    if (!response || response.length === 0) {
      $(domElements.paymentTableBody).html(
        `<tr><td colspan="11" class="text-center">No employee payments found.</td></tr>`
      );
      return;
    }

    let tableRows = "";
    response.forEach((payment) => {
      tableRows += createTableRow(payment);
    });

    $(domElements.paymentTableBody).html(tableRows);
  } catch (error) {
    console.error("Error loading employee payments:", error);
    showError("Failed to load employee payments.");
    $(domElements.paymentTableBody).html(
      `<tr><td colspan="11" class="text-center">Failed to load employee payments. Please try again later.</td></tr>`
    );
  }
}

/**
 * @function editField
 * @description Enables editing mode for the specified table row.
 * @param {jQuery} row - The jQuery object representing the table row.
 */
function editField(row) {
  row.find("input, select").prop("disabled", false); // Enable form fields
  row.find(".save-btn").prop("disabled", false); // Enable Save button
}

/**
 * @function savePayment
 * @description Saves the updated payment information.
 * @param {jQuery} button - The jQuery object representing the "Save" button.
 */
async function savePayment(button) {
  const row = button.closest("tr");
  const paymentId = button.data("payment-id");
  const userId = button.data("user-id");

  // Collect updated payment data from input fields
  const updatedPayment = {
    user_id: userId,
    annual_pay: row.find(".annual-salary").val().trim(),
    work_hours_per_week: row.find(".weekly-hours").val().trim(),
    termination_pay: row.find(".termination-pay").val().trim(),
    payment_type_id: row.find(".payment-type").val(),
  };

  try {
    let apiResponse;

    if (paymentId === DEFAULT_PAYMENT_ID) {
      // Create new payment
      apiResponse = await UserPaymentApi.createRelUserPayment(updatedPayment);
      showSuccess("Payment Created Successfully");
    } else {
      // Update existing payment
      apiResponse = await UserPaymentApi.updateRelUserPayment(
        paymentId,
        updatedPayment
      );
      showSuccess("Payment Updated Successfully");
    }

    // Update the updated date cell
    const updatedDate = formatDate(apiResponse.last_updated_date);
    row.find("td:nth-child(10)").text(updatedDate);
  } catch (error) {
    console.error("Error updating payment:", error);
    showError(`Failed to save payment information. ${error.message}`);
  } finally {
    // Always disable the input elements and save buttons
    row.find("input, select").prop("disabled", true);
    button.prop("disabled", true);
  }
}

/**
 * @function setupEventListeners
 * @description Sets up event listeners for various actions.
 */
function setupEventListeners() {
  // Search Form Submission
  $(domElements.searchForm).on("submit", (e) => {
    e.preventDefault();
    loadEmployeePayment();
  });

  // Edit Button Click
  $(domElements.paymentTableBody).on("click", ".edit-btn", function () {
    const row = $(this).closest("tr");
    editField(row);
  });

  // Save Button Click
  $(domElements.paymentTableBody).on("click", ".save-btn", function () {
    savePayment($(this));
  });
}

/**
 * @function initializePage
 * @description Initializes the page by populating dropdowns, loading employee payments, and setting up event listeners.
 */
async function initializePage() {
  try {
    // Populate dropdowns
    await Promise.all([
      populateDropdown(domElements.searchDepartment, "department"),
      populateDropdown(domElements.searchEmpStatus, "employee_status"),
      populateDropdown("#addPaymentType", "payment_type"), // Assuming you have a create form as well
    ]);

    // Load employee payment data
    loadEmployeePayment();

    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    console.error("Page initialization error:", error);
    showError("Failed to initialize the page.");
  }
}

// --- Document Ready ---
$(document).ready(initializePage);
