import * as UserTrainingApi from "./services/userTrainingServices.js";
import * as TrainingModuleApi from "./services/trainingModuleServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";

import { accessVerify } from "./utils/authVerify.js"; // Assuming authVerify returns boolean
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js"; // Ensure these utilities are robust

// --- Constants ---
const STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  VERIFYING: "verifying",
  COMPLETED: "completed",
};

const DEPARTMENT = {
  ALL: "all", // Assuming 'all' is the name for the general department
};

// --- Global Variables / State ---
let loginUser = null;
let statusTypes = []; // Store fetched status types { id, name }
let trainingDepartments = []; // Store fetched departments { id, name }

// --- DOM Selectors Cache ---
const selectors = {
  searchLineId: "#searchLineId",
  searchTrainingName: "#searchTrainingName",
  searchUserName: "#searchUserName",
  searchDepartment: "#searchDepartment",
  searchStatus: "#searchStatus",
  processQueryBtn: "#processQuery",
  trainingTableBody: "#trainingTableBody",
  userNameInput: "#searchUserName", // Specific selector for disabling
};

// --- Utility Functions ---

/**
 * Displays an error message using SweetAlert.
 * @param {string} title - The title of the alert.
 * @param {string | Error} error - The error message or Error object.
 */
function showError(title, error) {
  console.error(title, error); // Log detailed error for debugging
  const message = error instanceof Error ? error.message : String(error);
  Swal.fire(title, message, "error");
}

/**
 * Finds a status object by its name (case-insensitive).
 * @param {string} name - The status name.
 * @returns {{id: any, name: string} | null} The status object or null if not found.
 */
function getStatusByName(name) {
  return statusTypes.find((item) => isEqualIgnoreCase(item.name, name)) || null;
}

/**
 * Finds a department object by its name (case-insensitive).
 * @param {string} name - The department name.
 * @returns {{id: any, name: string} | null} The department object or null if not found.
 */
function getDepartmentByName(name) {
  return (
    trainingDepartments.find((item) => isEqualIgnoreCase(item.name, name)) ||
    null
  );
}

// --- Data Fetching and Processing ---

/**
 * Fetches and populates object type dropdowns.
 * @param {string} dropdownSelector - CSS selector for the dropdown.
 * @param {string} taskName - The name of the object type task.
 * @param {Array<{id: any, name: string}>} targetArray - Array to store fetched items.
 */
async function populateDropdown(dropdownSelector, taskName, targetArray) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];

    // Store fetched items with standardized keys
    targetArray.length = 0; // Clear previous data
    items.forEach((item) => {
      targetArray.push({
        id: item.object_type_item_key,
        name: item.object_type_item_value,
      });
    });

    const options = items
      .map(
        (item) =>
          `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
      )
      .join("");

    // Prepend the "-- Select --" option
    $(dropdownSelector).html(
      `<option value="" selected>-- Select --</option>${options}`
    );
  } catch (error) {
    showError(`Error populating ${taskName} dropdown`, error);
  }
}

/**
 * Renders action buttons based on training status and user permissions.
 * @param {object} training - The training record object.
 * @returns {string} HTML string for the action buttons.
 */
function renderActionButtons(training) {
  let buttons = [];
  const status = training.training_status?.toLowerCase(); // Handle potential null/undefined
  const isUserAssigned = loginUser?.user_id === training.user_id;
  const isUserInVerifyDept =
    loginUser?.department_id === training.training_department_id;
  const isDeptAll = isEqualIgnoreCase(
    training.training_department,
    DEPARTMENT.ALL
  );
  const canFullyManage = accessVerify("Training Full Access"); // Check permission

  // --- Button Logic ---
  const startButton = `<button class="btn btn-primary btn-sm btn-start" data-id="${training.id}" title="Start Training"><i class="fas fa-play"></i></button>`;
  const verifyButton = `<button class="btn btn-warning btn-sm btn-verify" data-id="${training.id}" title="Submit for Verification"><i class="fas fa-check"></i></button>`;
  const completeButton = `<button class="btn btn-success btn-sm btn-complete" data-id="${training.id}" title="Mark as Completed"><i class="fas fa-check-double"></i></button>`;

  if (canFullyManage) {
    // Full access user can perform any action regardless of status (within reason)
    buttons.push(startButton, verifyButton, completeButton);
  } else {
    // Role-based logic
    if (status === STATUS.PENDING && isUserAssigned) {
      buttons.push(startButton);
    }
    if (status === STATUS.PROCESSING && isUserAssigned) {
      buttons.push(verifyButton);
    }
    if (status === STATUS.VERIFYING) {
      // User in the verifying department OR if department is 'all' (potentially any verifier?)
      // Clarification needed on 'all' department verification logic
      if (isUserInVerifyDept || isDeptAll) {
        buttons.push(completeButton);
      }
    }
  }

  // Handle the specific 'all' department case overrides if needed (adjust based on exact rules)
  if (isDeptAll && !canFullyManage) {
    buttons = []; // Reset for 'all' department if standard logic doesn't fit
    if (status === STATUS.PENDING && isUserAssigned) {
      buttons.push(startButton);
    }
    if (status === STATUS.PROCESSING && isUserAssigned) {
      buttons.push(verifyButton);
    }
    // For 'all' department, maybe *any* authorized verifier (not just assigned user) can complete?
    // This requires clarification. Assuming any authorized user can complete if status is verifying.
    if (
      status ===
      STATUS.VERIFYING /* && userHasVerifierRole - potentially check another permission */
    ) {
      // If there isn't a specific verifier role, maybe only full access can complete 'all' dept?
      // Sticking to the provided logic: any assigned/department user can complete if 'verifying'
      buttons.push(completeButton);
    }
  }

  return buttons.join(" "); // Join buttons with spaces
}

/**
 * Loads user training data based on filters and renders the table.
 */
async function loadUserTraining() {
  const tableBody = $(selectors.trainingTableBody);
  tableBody.html(`
    <tr>
      <td colspan="8" class="text-center p-5">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <p class="mt-2">Loading training data...</p>
      </td>
    </tr>
  `);

  try {
    const filters = {
      training_name: $(selectors.searchTrainingName).val(),
      user_name: $(selectors.searchUserName).val(),
      department: $(selectors.searchDepartment).val(),
      status: $(selectors.searchStatus).val(),
      user_childtask_id: $(selectors.searchLineId).val(), // Used for navigation init
    };

    const trainings = await UserTrainingApi.getTrainingModuleViewByCondition(
      filters
    );

    if (!trainings || trainings.length === 0) {
      tableBody.html(`
        <tr>
          <td colspan="8" class="text-center p-4 text-muted">No training records found matching your criteria.</td>
        </tr>
      `);
      return;
    }

    let tableRows = "";
    trainings.forEach((training) => {
      const actionButtons = renderActionButtons(training);
      tableRows += `
        <tr>
          <td>${training.user_name || "-"}</td>
          <td>${training.training_module_name || "-"}</td>
          <td><span class="badge badge-${getStatusBadge(
            training.training_status
          )}">${training.training_status || "-"}</span></td>
          <td>${training.training_department || "-"}</td>
          <td>${training.verified_name || "-"}</td>
          <td>${formatDate(training.start_date)}</td>
          <td>${formatDate(training.end_date)}</td>
          <td class="text-center action-buttons">${actionButtons || "-"}</td>
        </tr>
      `;
    });
    tableBody.html(tableRows);
  } catch (error) {
    showError("Error Loading Training Data", error);
    tableBody.html(`
      <tr>
        <td colspan="8" class="text-center p-4 text-danger">Failed to load training data. Please try again later.</td>
      </tr>
    `);
  }
}

/**
 * Determines the Bootstrap badge class based on status.
 * @param {string} status - The training status.
 * @returns {string} Bootstrap badge class (e.g., 'primary', 'warning').
 */
function getStatusBadge(status) {
  const lowerStatus = status?.toLowerCase();
  switch (lowerStatus) {
    case STATUS.PENDING:
      return "secondary";
    case STATUS.PROCESSING:
      return "info";
    case STATUS.VERIFYING:
      return "warning";
    case STATUS.COMPLETED:
      return "success";
    default:
      return "light";
  }
}

/**
 * Updates the status of a user training record.
 * @param {number | string} trainingId - The ID of the user training record.
 * @param {string} targetStatusName - The desired new status name (e.g., 'processing').
 */
async function updateTrainingStatus(trainingId, targetStatusName) {
  try {
    const userTraining = await UserTrainingApi.findUserTrainingById(trainingId);
    if (!userTraining) {
      throw new Error("Training record not found.");
    }

    const trainingModule = await TrainingModuleApi.getTrainingModuleById(
      userTraining.training_module_id
    );
    if (!trainingModule) {
      throw new Error("Associated training module not found.");
    }

    const targetStatus = getStatusByName(targetStatusName);
    if (!targetStatus) {
      throw new Error(`Invalid target status: ${targetStatusName}`);
    }

    const updates = { status: targetStatus.id };

    // --- Business Logic for Status Transitions ---
    if (targetStatusName === STATUS.PROCESSING) {
      updates.start_date = new Date();
    } else if (targetStatusName === STATUS.COMPLETED) {
      const isSelfCompletingNonAllDept =
        userTraining.user_id === loginUser.user_id &&
        !isEqualIgnoreCase(
          getDepartmentById(trainingModule.training_department_id)?.name,
          DEPARTMENT.ALL
        ); // Check using ID->Name lookup

      if (isSelfCompletingNonAllDept && !accessVerify("Training Full Access")) {
        // Allow self-complete if full access
        Swal.fire(
          "Action Denied",
          "You cannot mark your own training as completed for this department.",
          "warning"
        );
        return; // Prevent update
      }
      updates.end_date = new Date();
      updates.verified_by = loginUser.user_id;
    }

    // Perform the update
    await UserTrainingApi.updateUserTraining(userTraining.id, updates);

    Swal.fire(
      "Success",
      `Training status updated to ${targetStatusName}.`,
      "success"
    );
    loadUserTraining(); // Refresh the table
  } catch (error) {
    showError(`Error updating training status to ${targetStatusName}`, error);
  }
}

/**
 * Gets department name from its ID.
 * @param {any} id - Department ID.
 * @returns {string | null} Department name or null.
 */
function getDepartmentById(id) {
  return trainingDepartments.find((dept) => dept.id == id) || null; // Use == for potential type flexibility if needed, else ===
}

// --- Initialization and Navigation ---

/**
 * Handles navigation from related modules (e.g., User Task) by URL parameters.
 */
async function handleNavigation() {
  // Example using URLSearchParams (more robust if params are in query string)
  // const urlParams = new URLSearchParams(window.location.search);
  // const lineId = urlParams.get('lineid');
  // const trainingDeptId = urlParams.get('trainingdeptid');
  // const userId = urlParams.get('userid');

  // Using path segments as per original logic
  const pathParts = window.location.pathname.split("/");
  const lineIdIndex = pathParts.indexOf("lineid") + 1;
  const trainingDeptIdIndex = pathParts.indexOf("trainingdeptid") + 1;
  const userIdIndex = pathParts.indexOf("userid") + 1;

  const lineId =
    lineIdIndex > 0 && lineIdIndex < pathParts.length
      ? pathParts[lineIdIndex]
      : null;
  const trainingDeptId =
    trainingDeptIdIndex > 0 && trainingDeptIdIndex < pathParts.length
      ? pathParts[trainingDeptIdIndex]
      : null;
  const userId =
    userIdIndex > 0 && userIdIndex < pathParts.length
      ? pathParts[userIdIndex]
      : null;

  if (lineId && trainingDeptId && userId) {
    console.log(
      `Navigation detected: lineId=${lineId}, deptId=${trainingDeptId}, userId=${userId}`
    );
    $(selectors.searchDepartment).val(trainingDeptId);
    $(selectors.searchLineId).val(lineId); // Store for potential initial query

    const canInitialize =
      userId == loginUser?.user_id || accessVerify("Training Full Access");

    if (canInitialize) {
      await initializeUserTrainingForTask(lineId, trainingDeptId, userId);
      // Keep the filter applied from navigation? Or clear it?
      // Current behaviour: loadUserTraining called later will use these filters.
    } else {
      console.warn(
        "User does not have permission to initialize training for this task via URL."
      );
      // Clear the navigation parameters if user shouldn't see filtered results?
      // $(selectors.searchDepartment).val('');
      // $(selectors.searchLineId).val('');
    }
  }
}

/**
 * Initializes user training records for a specific task line if they don't exist.
 * @param {string | number} lineId - The identifier linking to the task/item.
 * @param {string | number} trainingDeptId - The ID of the relevant training department.
 * @param {string | number} userId - The ID of the user to assign training to.
 */
async function initializeUserTrainingForTask(lineId, trainingDeptId, userId) {
  try {
    // Check if training already exists for this line item to prevent duplicates
    const existingTrainings =
      await UserTrainingApi.getTrainingModuleViewByCondition({
        user_childtask_id: lineId,
        // Optionally filter by user_id and/or department_id here if the view supports it
        // user_id: userId,
        // department: trainingDeptId
      });

    if (existingTrainings && existingTrainings.length > 0) {
      console.log(`User training for lineId ${lineId} already exists.`);
      return; // Exit if initialization already done
    }

    // Fetch training modules relevant to the department
    const modulesToAssign =
      await TrainingModuleApi.getTrainingModuleByDepartmentId(trainingDeptId);

    if (!modulesToAssign || modulesToAssign.length === 0) {
      console.log(
        `No training modules found for department ID ${trainingDeptId}.`
      );
      return; // No modules to assign
    }

    // Create pending training records for the user for each module
    const creationPromises = modulesToAssign.map((module) =>
      UserTrainingApi.createUserTraining({
        user_id: userId,
        training_module_id: module.training_module_id,
        status: getStatusByName(STATUS.PENDING)?.id, // Use status ID
        link_user_childtask_id: lineId,
      })
    );

    await Promise.all(creationPromises);
    console.log(
      `Successfully initialized ${modulesToAssign.length} training records for user ${userId}, lineId ${lineId}.`
    );
    // No need to call loadUserTraining here, it will be called after initialization steps complete.
  } catch (error) {
    showError(`Error initializing user training for lineId ${lineId}`, error);
  }
}

// --- Event Listeners ---

function setupEventListeners() {
  // Filter button
  $(selectors.processQueryBtn).on("click", (e) => {
    e.preventDefault();
    $(selectors.searchLineId).val(""); // Clear navigation helper field on manual query
    loadUserTraining();
  });

  // Action buttons (using event delegation)
  $(selectors.trainingTableBody).on("click", ".btn-start", (event) => {
    const id = $(event.currentTarget).data("id");
    updateTrainingStatus(id, STATUS.PROCESSING);
  });

  $(selectors.trainingTableBody).on("click", ".btn-verify", (event) => {
    const id = $(event.currentTarget).data("id");
    updateTrainingStatus(id, STATUS.VERIFYING);
  });

  $(selectors.trainingTableBody).on("click", ".btn-complete", (event) => {
    const id = $(event.currentTarget).data("id");
    updateTrainingStatus(id, STATUS.COMPLETED);
  });
}

// --- Initialization ---

/**
 * Initializes the page: fetches data, sets up UI, and attaches event listeners.
 */
async function initializePage() {
  loginUser = JSON.parse(sessionStorage.getItem("user"));
  if (!loginUser) {
    showError(
      "Authentication Error",
      "User not logged in. Please log in again."
    );
    // Optionally redirect to login page
    // window.location.href = '/login';
    return;
  }

  // Fetch necessary lookup data first
  await Promise.all([
    populateDropdown(
      selectors.searchDepartment,
      "training_department",
      trainingDepartments
    ),
    populateDropdown(selectors.searchStatus, "training_status", statusTypes),
    // Add other lookups if needed
  ]);

  // Handle potential navigation from other modules *after* lookups are done
  await handleNavigation();

  // Configure UI based on permissions
  if (!accessVerify("Training Full Access")) {
    $(selectors.userNameInput).val(loginUser.username).prop("disabled", true);
  }

  // Load initial table data (might be filtered by navigation)
  await loadUserTraining();

  // Setup event listeners
  setupEventListeners();
}

// --- Document Ready ---
$(document).ready(initializePage);
