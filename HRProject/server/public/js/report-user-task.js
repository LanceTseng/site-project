/**
 * @file report-user-task.js
 * @description Manages user tasks and subtasks, including filtering, display, and status updates.
 */

import * as UserTaskViewApi from "./services/userTaskViewServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import * as DocumentApi from "./services/documentServices.js";
import * as FileApi from "./services/fileServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";

import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";
import { accessVerify } from "./utils/authVerify.js";

// --- Constants ---
const TASK_GROUP_TASK_NAME = "task_group";
const PARENT_TASK = "parent";
const CHILD_TASK = "child";

// --- DOM Element Caching ---
const domElements = {
  taskFilter: "#taskFilter",
  userFilter: "#userFilter",
  taskGroupFilter: "#taskGroupFilter",
  processQuery: "#processQuery",
  userTaskHeaderList: "#userTaskHeaderList",
  userTaskDetailList: "#userTaskDetailList",
};

// --- Global Variables ---
let loginUser = null;
let taskGroups = [];

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
    taskGroups = items;
    let options = `<option value="">Select an Option</option>`;

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
 * @function getStatusButton
 * @description Returns the HTML for a "Start" or "Complete" button based on the task status.
 * @param {string} status - The task status.
 * @param {string} taskId - The ID of the task.
 * @param {string} type - The type of task ("parent" or "child").
 * @param {string} headId - The ID of the task head (only for child tasks).
 * @returns {string} The HTML for the status button.
 */
function getStatusButton(status, taskId, type, headId = null) {
  if (isEqualIgnoreCase(status, "Pending")) {
    return `<button class="btn btn-outline-dark btn-sm start-${type}-task" data-id="${taskId}" ${
      headId ? `data-headid="${headId}"` : ""
    }>Start</button>`;
  }
  if (isEqualIgnoreCase(status, "Processing")) {
    return `<button class="btn btn-outline-success btn-sm complete-${type}-task" data-id="${taskId}" ${
      headId ? `data-headid="${headId}"` : ""
    }>Complete</button>`;
  }
  return "N/A";
}

/**
 * @function displayUserTaskHeader
 * @description Fetches and displays the list of parent tasks in the User Task Header table based on the filter criteria.
 */
async function displayUserTaskHeader() {
  try {
    const taskName = $(domElements.taskFilter).val();
    const userName = $(domElements.userFilter).val();
    const taskGroupId = $(domElements.taskGroupFilter).val();
    const userId = loginUser.user_id;

    let filterParams = { taskName, userName, taskGroupId };

    if (!accessVerify("User Task Access All")) {
      filterParams.userId = userId;
    }

    const loadingRow = `
        <tr>
            <td colspan="10" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p>Loading task headers...</p>
            </td>
        </tr>`;
    $(domElements.userTaskHeaderList).html(loadingRow);

    const userParentTasks = await UserTaskViewApi.getUserParentTaskByCondition({
      taskName: filterParams.taskName,
      userName: filterParams.userName,
      taskGroupId: filterParams.taskGroupId,
      userId: filterParams.userId,
    });

    if (!userParentTasks || userParentTasks.length === 0) {
      $(domElements.userTaskHeaderList).html(
        `<tr><td colspan="10" class="text-center">No tasks found.</td></tr>`
      );
      return;
    }

    const taskRows = userParentTasks.map(buildTaskRow).join("");
    $(domElements.userTaskHeaderList).html(taskRows);
  } catch (error) {
    console.error("Error displaying user tasks:", error);
    showError("Failed to load user tasks.");
    $(domElements.userTaskHeaderList).html(
      `<tr><td colspan="10" class="text-center">Failed to load user tasks. Please try again later.</td></tr>`
    );
  }
}

/**
 * @function buildTaskRow
 * @description Constructs a table row for a parent task.
 * @param {object} task - The parent task data.
 * @returns {string} The HTML for the table row.
 */
function buildTaskRow(task) {
  const processRate =
    task.count_child_tasks > 0
      ? (task.child_tasks_completed / task.count_child_tasks) * 100
      : 0;
  return `
    <tr class="task-row" data-task-head-id="${task.head_id}">
      <td>${task.user_name || ""}</td>
      <td>${task.pt_name || ""}</td>
      <td>${task.pt_desc || ""}</td>
      <td>${task.task_group_name || ""}</td>
      <td>${task.pt_status_name || ""}</td>
      <td>${processRate.toFixed(2)}%</td>
      <td>${formatDate(task.pt_start_date) || ""}</td>
      <td>${formatDate(task.pt_end_date) || ""}</td>
      <td>${
        formatDate(task.last_updated_date) ||
        formatDate(task.created_date) ||
        ""
      }</td>
      <td class="text-center">${getStatusButton(
        task.pt_status_name,
        task.head_id,
        PARENT_TASK
      )}</td>
    </tr>
  `;
}

/**
 * @function handleParentTaskStart
 * @description Handles the start of a parent task, potentially starting all subtasks as well.
 * @param {string} user_task_head_id - The ID of the parent task.
 */
async function handleParentTaskStart(user_task_head_id) {
  try {
    const head_task = await UserTaskViewApi.getUserTaskByHeadId(
      user_task_head_id
    );

    Swal.fire({
      title: "Start All Subtasks?",
      text: `Are you sure you want to start all subtasks under [${head_task.pt_name}]?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await startBatchChildTasks(user_task_head_id);
        await startParentTask(user_task_head_id);
        await displayUserTaskHeader();
        await displayUserTaskDetail(user_task_head_id);
        showSuccess("All subtasks have been started.");
      } else {
        showSuccess("Only the parent task remains unchanged.");
      }
    });
  } catch (error) {
    console.error("Error processing tasks:", error);
    showError("Something went wrong. Please try again.");
  }
}

/**
 * @function handleParentTaskComplete
 * @description Handles the completion of a parent task, potentially completing all subtasks as well.
 * @param {string} user_task_head_id - The ID of the parent task.
 */
async function handleParentTaskComplete(user_task_head_id) {
  try {
    const head_task = await UserTaskViewApi.getUserTaskByHeadId(
      user_task_head_id
    );

    Swal.fire({
      title: "Complete All Subtasks?",
      text: `Are you sure you want to complete all subtasks under [${head_task.pt_name}]?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await completeBatchChildTasks(user_task_head_id);
        await completeParentTask(user_task_head_id);
        await displayUserTaskHeader();
        await displayUserTaskDetail(user_task_head_id);
        showSuccess("All subtasks have been completed.");
      } else {
        showSuccess("Only the parent task remains unchanged.");
      }
    });
  } catch (error) {
    console.error("Error processing tasks:", error);
    showError("Something went wrong. Please try again.");
  }
}

/**
 * @function handleChildTaskComplete
 * @description Handles the completion of a child task, potentially completing the parent task if all child tasks are complete.
 * @param {string} user_task_line_id - The ID of the child task.
 * @param {string} user_task_head_id - The ID of the parent task.
 */
async function handleChildTaskComplete(user_task_line_id, user_task_head_id) {
  try {
    const child_task = await UserTaskViewApi.getUserTaskByLineId(
      user_task_line_id
    );

    Swal.fire({
      title: "Complete Subtask?",
      text: `Are you sure you want to complete the subtask [${child_task.ct_name}]?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Complete",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await completeSingleChildTask(user_task_line_id);

        const child_tasks = await UserTaskViewApi.getUserChildTaskByTaskId(
          user_task_head_id
        );
        const uncompleted_child_tasks = child_tasks.filter(
          (task) => !isEqualIgnoreCase(task.ct_status_name, "completed")
        ).length;

        if (uncompleted_child_tasks === 0) {
          await completeParentTask(user_task_head_id);
        }

        await Promise.all([
          displayUserTaskHeader(),
          displayUserTaskDetail(user_task_head_id),
        ]);

        showSuccess("The subtask has been completed.");
      } else {
        showSuccess("The subtask remains unchanged.");
      }
    });
  } catch (error) {
    console.error("Error processing tasks:", error);
    showError("Something went wrong. Please try again.");
  }
}

/**
 * @function handleChildTaskStart
 * @description Handles the start of a child task.
 * @param {string} user_task_line_id - The ID of the child task.
 * @param {string} user_task_head_id - The ID of the parent task.
 */
async function handleChildTaskStart(user_task_line_id, user_task_head_id) {
  try {
    const child_task = await UserTaskViewApi.getUserTaskByLineId(
      user_task_line_id
    );

    Swal.fire({
      title: "Start Subtask?",
      text: `Are you sure you want to start the subtask [${child_task.ct_name}]?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await startSingleChildTask(user_task_line_id);
        await startParentTask(user_task_head_id);
        await Promise.all([
          displayUserTaskHeader(),
          displayUserTaskDetail(user_task_head_id),
        ]);
        showSuccess("The subtask has been started.");
      } else {
        showSuccess("The subtask remains unchanged.");
      }
    });
  } catch (error) {
    console.error("Error processing tasks:", error);
    showError("Something went wrong. Please try again.");
  }
}

/**
 * @function handleChildTaskFileUpload
 * @description Handles the upload of a file associated with a child task.
 * @param {string} user_task_line_id - The ID of the child task.
 */
async function handleChildTaskFileUpload(user_task_line_id) {
  try {
    const user_child_task = await UserChildTaskApi.getTaskById(
      user_task_line_id
    );

    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "*/*";

    fileInput.addEventListener("change", async function () {
      if (!fileInput.files.length) return;

      const selectedFile = fileInput.files[0];

      try {
        // Upload file using Axios
        const response = await FileApi.uploadFile(selectedFile);

        //update to child task document
        const file = await FileApi.getFileUrl(response.filename);

        user_child_task.document_path = file.fileurl;
        await UserChildTaskApi.updateTask(user_task_line_id, user_child_task);

        Swal.fire("Started!", "File upload successfully.", "success");

        await displayUserTaskHeader();
        await displayUserTaskDetail(user_child_task.user_parenttask_id);
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        Swal.fire("Error", "File upload failed.", "error");
      }
    });

    // Trigger file selection
    fileInput.click();
  } catch (error) {
    console.error("Error processing tasks:", error);
    Swal.fire("Error", "Something went wrong. Please try again.", "error");
  }
}

/**
 * @function startBatchChildTasks
 * @description Starts all child tasks associated with a given parent task.
 * @param {string} taskHeadId - The ID of the parent task.
 */
async function startBatchChildTasks(taskHeadId) {
  try {
    const childTasks = await UserTaskViewApi.getUserChildTaskByTaskId(
      taskHeadId
    );
    for (const task of childTasks) {
      const updatedTask = await UserChildTaskApi.getTaskById(task.line_id);
      updatedTask.status = 1;
      updatedTask.start_date = new Date();
      await UserChildTaskApi.updateTask(task.line_id, updatedTask);
    }
  } catch (error) {
    console.error("Error starting batch child tasks:", error);
    showError("Failed to start all child tasks.");
  }
}

/**
 * @function completeBatchChildTasks
 * @description Completes all child tasks associated with a given parent task.
 * @param {string} taskHeadId - The ID of the parent task.
 */
async function completeBatchChildTasks(taskHeadId) {
  try {
    const childTasks = await UserTaskViewApi.getUserChildTaskByTaskId(
      taskHeadId
    );
    for (const task of childTasks) {
      const updatedTask = await UserChildTaskApi.getTaskById(task.line_id);
      updatedTask.status = 2;
      updatedTask.end_date = new Date();
      await UserChildTaskApi.updateTask(task.line_id, updatedTask);
    }
  } catch (error) {
    console.error("Error completing batch child tasks:", error);
    showError("Failed to complete all child tasks.");
  }
}

/**
 * @function startSingleChildTask
 * @description Starts a single child task.
 * @param {string} taskLineId - The ID of the child task.
 */
async function startSingleChildTask(taskLineId) {
  try {
    const updatedTask = await UserChildTaskApi.getTaskById(taskLineId);
    updatedTask.status = 1;
    updatedTask.start_date = new Date();
    await UserChildTaskApi.updateTask(taskLineId, updatedTask);
  } catch (error) {
    console.error("Error starting single child task:", error);
    showError("Failed to start the child task.");
  }
}

/**
 * @function completeSingleChildTask
 * @description Completes a single child task.
 * @param {string} taskLineId - The ID of the child task.
 */
async function completeSingleChildTask(taskLineId) {
  try {
    const updatedTask = await UserChildTaskApi.getTaskById(taskLineId);
    updatedTask.status = 2;
    updatedTask.end_date = new Date();
    await UserChildTaskApi.updateTask(taskLineId, updatedTask);
  } catch (error) {
    console.error("Error completing single child task:", error);
    showError("Failed to complete the child task.");
  }
}

/**
 * @function startParentTask
 * @description Starts a parent task.
 * @param {string} taskHeadId - The ID of the parent task.
 */
async function startParentTask(taskHeadId) {
  try {
    const parentTask = await UserParentTaskApi.getTaskById(taskHeadId);
    if (!isEqualIgnoreCase(parentTask.pt_status_name, "processing")) {
      parentTask.status = 1;
      parentTask.start_date = new Date();
      await UserParentTaskApi.updateTask(taskHeadId, parentTask);
    }
  } catch (error) {
    console.error("Error starting parent task:", error);
    showError("Failed to start the parent task.");
  }
}

/**
 * @function completeParentTask
 * @description Completes a parent task.
 * @param {string} taskHeadId - The ID of the parent task.
 */
async function completeParentTask(taskHeadId) {
  try {
    const parentTask = await UserParentTaskApi.getTaskById(taskHeadId);
    if (!isEqualIgnoreCase(parentTask.pt_status_name, "processing")) {
      parentTask.status = 2;
      parentTask.end_date = new Date();
      await UserParentTaskApi.updateTask(taskHeadId, parentTask);
    }
  } catch (error) {
    console.error("Error completing parent task:", error);
    showError("Failed to complete the parent task.");
  }
}

/**
 * @function displayUserTaskDetail
 * @description Fetches and displays the details of child tasks related to a selected parent task in the User Task Detail table.
 * @param {string} taskHeadId - The ID of the parent task.
 */
async function displayUserTaskDetail(taskHeadId) {
  try {
    const taskDetails = await UserTaskViewApi.getUserChildTaskByTaskId(
      taskHeadId
    );

    const taskDetailRows = taskDetails.length
      ? taskDetails.map(buildTaskDetailRow).join("")
      : "<tr><td colspan='15' class='text-center'>No details available</td></tr>";
    $(domElements.userTaskDetailList).html(taskDetailRows);
  } catch (error) {
    console.error(
      `Error fetching task details for head ID ${taskHeadId}:`,
      error
    );
    showError("Failed to load task details.");
    $(domElements.userTaskDetailList).html(
      `<tr><td colspan="15" class="text-center">Failed to load task details. Please try again later.</td></tr>`
    );
  }
}

/**
 * @function getOfficalDocumentFile
 * @description Retrieves the official document file URL based on the document ID.
 * @param {string} documentId - The ID of the document.
 * @returns {Promise<string>} A promise that resolves with the file URL or an empty string if there's an error.
 */
async function getOfficalDocumentFile(documentId) {
  try {
    const response = await DocumentApi.getTaskById(documentId);

    if (!response || !response.document_path) return "";

    const fileResponse = await FileApi.getOfficalFileUrl(
      response.document_path
    );

    return fileResponse?.fileurl || "";
  } catch (error) {
    console.error("Error fetching official document file:", error);
    return "";
  }
}

/**
 * @function buildTaskDetailRow
 * @description Builds a table row for a child task.
 * @param {object} detail - The child task data.
 * @returns {string} The HTML for the table row.
 */
function buildTaskDetailRow(detail) {
  const fileUrl = detail.document_path || "";
  const filename = fileUrl
    ? fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
    : "";

  const rowId = `task-row-${detail.line_id}`;
  const documentCellId = `document-link-${detail.line_id}`;

  const uploadButton =
    detail.require_upload &&
    isEqualIgnoreCase(detail.ct_status_name, "processing")
      ? `<button class="btn btn-secondary btn-sm upload-file-btn" data-id="${detail.line_id}">Upload File</button>`
      : "";

  const fileLink = fileUrl
    ? `<a href="${fileUrl}" target="_blank">${filename}</a>`
    : "No file";

  const surveyLink = detail.survey_id
    ? isEqualIgnoreCase(detail.ct_status_name, "processing")
      ? `<a href="/form/${detail.survey_id}/lineid/${detail.line_id}" target="_self">${detail.survey_name}</a>`
      : isEqualIgnoreCase(detail.ct_status_name, "completed")
      ? `<a href="/form-review/${detail.line_id}" target="_self">${detail.survey_name}(Review)</a>`
      : `${detail.survey_name}`
    : "";

  const handoverLink = detail.hand_over_id
    ? isEqualIgnoreCase(detail.ct_status_name, "processing")
      ? `<a href="/form-handover/lineid/${detail.line_id}" target="_self">Hand Over Form</a>`
      : isEqualIgnoreCase(detail.ct_status_name, "completed")
      ? `<a href="/form-handover/review/${detail.line_id}" target="_self">Hand Over Form(Review)</a>`
      : `Handover Required`
    : "";

  const trainingLink = detail.training_module_id
    ? isEqualIgnoreCase(detail.ct_status_name, "processing")
      ? `<a href="/report-training/lineid/${detail.line_id}/trainingdeptid/${detail.training_module_id}/userid/${detail.user_id}" target="_self">${detail.training_module_dept_name}</a>`
      : isEqualIgnoreCase(detail.ct_status_name, "completed")
      ? `<a href="/report-training" target="_self">${detail.training_module_dept_name}(Report)</a>`
      : `${detail.training_module_dept_name}`
    : "";

  // Construct the row HTML with data
  const rowHtml = `
    <tr id="${rowId}">
      <td>${detail.line_id || ""}</td>
      <td>${detail.ct_task_name || ""}</td>
      <td>${detail.ct_desc || ""}</td>
      <td>${detail.ct_status_name || ""}</td>
      <td id="${documentCellId}">${detail.document_name || ""}</td>
      <td>${uploadButton} ${fileLink}</td>
      <td>${detail.eqpt_type_name || ""}</td>
      <td>${
        detail.equipment_id ? `${detail.eqpt_name} (${detail.eqpt_code})` : ""
      }</td>
      <td>${trainingLink}</td>
      <td>${handoverLink}</td>
      <td>${surveyLink}</td>
      <td>${formatDate(detail.ct_start_date) || ""}</td>
      <td>${formatDate(detail.ct_end_date) || ""}</td>
      <td>${
        formatDate(detail.last_updated_date) ||
        formatDate(detail.created_date) ||
        ""
      }</td>
      <td class="text-center">${getStatusButton(
        detail.ct_status_name,
        detail.line_id,
        CHILD_TASK,
        detail.user_parenttask_id
      )}</td>
    </tr>
  `;

  // Update document link if document_id exists
  if (detail.document_id) {
    updateDocumentLink(detail.document_id, documentCellId);
  }

  return rowHtml;
}

/**
 * @function updateDocumentLink
 * @description Updates the document link in a table cell.
 * @param {string} documentId - The ID of the document.
 * @param {string} documentCellId - The ID of the table cell where the link should be placed.
 */
async function updateDocumentLink(documentId, documentCellId) {
  try {
    const officialUrl = await getOfficalDocumentFile(documentId);
    const documentCell = document.getElementById(documentCellId);

    if (documentCell) {
      if (officialUrl && typeof officialUrl === "string") {
        const link = `<a href="${officialUrl}" target="_blank">View Document</a>`;
        documentCell.innerHTML = link; // Use innerHTML for setting links
      } else {
        documentCell.textContent = "No Document"; // Default text if no link
      }
    }
  } catch (error) {
    console.error("Error updating document link:", error);
  }
}

/**
 * @function setupEventListeners
 * @description Sets up event listeners for various actions.
 */
function setupEventListeners() {
  // Process Query Click
  $(domElements.processQuery).on("click", displayUserTaskHeader);

  // User Task Header List Click
  $(domElements.userTaskHeaderList).on("click", ".task-row", function () {
    displayUserTaskDetail($(this).data("task-head-id"));
  });

  // Start Parent Task Click
  $(domElements.userTaskHeaderList).on(
    "click",
    ".start-parent-task",
    function () {
      handleParentTaskStart($(this).data("id"));
    }
  );

  // Start Child Task Click
  $(domElements.userTaskDetailList).on(
    "click",
    ".start-child-task",
    function () {
      handleChildTaskStart($(this).data("id"), $(this).data("headid"));
    }
  );

  // Complete Parent Task Click
  $(domElements.userTaskHeaderList).on(
    "click",
    ".complete-parent-task",
    function () {
      handleParentTaskComplete($(this).data("id"));
    }
  );

  // Complete Child Task Click
  $(domElements.userTaskDetailList).on(
    "click",
    ".complete-child-task",
    function () {
      handleChildTaskComplete($(this).data("id"), $(this).data("headid"));
    }
  );

  // Upload File Click
  $(domElements.userTaskDetailList).on(
    "click",
    ".upload-file-btn",
    function () {
      handleChildTaskFileUpload($(this).data("id"));
    }
  );
}

/**
 * @function initializePage
 * @description Initializes the page by loading user data, populating dropdowns, and setting up event listeners.
 */
async function initializePage() {
  try {
    loginUser = JSON.parse(sessionStorage.getItem("user"));
    if (!loginUser) {
      showError("User not logged in. Please log in again.");
      // Consider redirecting to login page
      return;
    }

    // Populate dropdowns
    await populateDropdown(domElements.taskGroupFilter, TASK_GROUP_TASK_NAME);

    // Load employee payment data
    await displayUserTaskHeader();

    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    console.error("Page initialization error:", error);
    showError("Failed to initialize the page.");
  }
}

// --- Document Ready ---
$(document).ready(initializePage);
