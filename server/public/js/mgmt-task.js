import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import { formatDate } from "./utils/stringUtils.js";
// isEqualIgnoreCase is not used in the provided logic, can be removed if not needed elsewhere
// import { isEqualIgnoreCase } from "./utils/stringUtils.js";

// --- DOM Element References ---
const filterTaskGroupSelect = $("#filterTaskGroup");
const filterEnabledSelect = $("#filterEnabled");
const applyFilterBtn = $("#applyFilterBtn");

const taskTableBody = $("#taskTableBody");
const tableFooter = $("#tableFooter");

const taskModal = $("#taskModal");
const taskModalLabel = $("#taskModalLabel");
const taskForm = $("#taskForm");
const taskIdInput = $("#taskId"); // Hidden input for ID
const taskNameInput = $("#taskName");
const taskDescriptionInput = $("#taskDescription");
const taskGroupIdSelect = $("#taskGroupId");
const taskEnabledSelect = $("#taskEnabled");
const saveTaskButton = $("#saveTask"); // Keep ref if needed for state, though submit is preferred trigger
const createTaskBtn = $(".create-btn"); // Button to open modal for adding

// --- UI Helper Functions ---
function handleError(error, context) {
  console.error(`${context}:`, error);
  const apiErrorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message;
  const message =
    apiErrorMessage || `An error occurred during ${context}. Please try again.`;
  Swal.fire("Error", message, "error");
}

async function populateDropdown(
  dropdownId,
  objectName,
  defaultOptionText = "-- Select --"
) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(objectName)) || [];
    let options = `<option value="">${defaultOptionText}</option>`; // Use empty value for "All" or default prompt
    options += items
      .map(
        (item) =>
          `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
      )
      .join("");
    $(dropdownId).html(options);
  } catch (error) {
    // Pass context to handleError for better debugging
    handleError(error, `populating ${objectName} dropdown (${dropdownId})`);
    $(dropdownId).html(`<option value="">Error loading</option>`);
  }
}

// --- Data Loading and Rendering ---

async function renderTasks() {
  taskTableBody.empty().html(
    // Clear and show loading spinner
    '<tr><td colspan="8" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading tasks...</td></tr>'
  );
  tableFooter.text("Loading...");

  try {
    const filterGroupId = filterTaskGroupSelect.val() || null; // Get selected group filter
    const filterEnabledValue = filterEnabledSelect.val(); // Get selected enabled filter ('', 'true', 'false')

    // Prepare params for API, handle empty string for enabled filter
    const params = {};
    if (filterGroupId) {
      params.task_group_id = filterGroupId;
    }
    // Only add enabled parameter if it's 'true' or 'false', not empty string
    if (filterEnabledValue === "true" || filterEnabledValue === "false") {
      // Convert string 'true'/'false' to boolean or 1/0 depending on API expectation
      params.enabled = filterEnabledValue === "true"; // Example: sending boolean
      // Or: params.enabled = filterEnabledValue === 'true' ? 1 : 0; // Example: sending 1/0
    }

    console.log("Fetching tasks with params:", params); // Log params
    const tasks = await ParentTaskApi.getParentTaskViewByCondition(params);

    taskTableBody.empty(); // Clear loading spinner after fetch

    if (!tasks || tasks.length === 0) {
      taskTableBody.append(
        '<tr><td colspan="8" class="text-center text-muted">No tasks found matching the criteria.</td></tr>'
      );
      tableFooter.text("No tasks found.");
      return;
    }

    tasks.forEach((task) => {
      const isEnabled = task.enabled === true || task.enabled === 1; // Handle boolean or 1/0
      const badgeClass = isEnabled ? "badge-success" : "badge-danger";
      const badgeText = isEnabled ? "Yes" : "No";

      const row = `
            <tr data-task-id="${task.task_id}">
                <td>${task.task_id}</td>
                <td>${task.task_name || ""}</td>
                <td>${task.task_description || ""}</td>
                <td>${task.task_group || "N/A"}</td>
                <td class="text-center"><span class="badge ${badgeClass}">${badgeText}</span></td>
                <td>${formatDate(task.created_date)}</td>
                <td>${formatDate(task.last_updated_date)}</td>
                <td class="text-center">
                    <button class="btn btn-info btn-sm edit-btn" title="Edit Task"
                            data-toggle="modal" data-target="#taskModal" data-task-id="${
                              task.task_id
                            }">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <a href="/mgmt-subtask/${
                      task.task_id
                    }" class="btn btn-warning btn-sm" title="Manage Subtasks">
                        <i class="fas fa-list-ol"></i> <!-- Example icon for subtasks -->
                    </a>
                     <!-- Optional Delete Button
                     <button class="btn btn-danger btn-sm delete-btn" title="Delete Task" data-task-id="${
                       task.task_id
                     }">
                         <i class="fas fa-trash-alt"></i>
                     </button>
                     -->
                </td>
            </tr>
            `;
      taskTableBody.append(row);
    });
    tableFooter.text(`${tasks.length} task(s) found.`);
  } catch (error) {
    handleError(error, "rendering tasks");
    taskTableBody.empty().html(
      // Clear spinner and show error
      '<tr><td colspan="8" class="text-center text-danger">Error loading tasks. Please try again.</td></tr>'
    );
    tableFooter.text("Error loading.");
  }
}

// --- Modal and Form Handling ---

// Handle Modal Opening (for Add and Edit)
async function handleModalOpen(event) {
  const button = $(event.relatedTarget); // Button that triggered the modal
  const taskId = button.data("task-id"); // Extract task ID from button's data attribute
  const modal = $(this); // The modal itself

  taskForm[0].reset(); // Reset form to clear previous inputs
  taskIdInput.val(""); // Clear the hidden ID field specifically

  // Reset button state (important if previous save failed)
  saveTaskButton.prop("disabled", false).html("Save Task");

  if (taskId) {
    // --- EDIT MODE ---
    taskModalLabel.text("Edit Task");
    taskIdInput.val(taskId); // Set the hidden ID field

    try {
      // Fetch task details via API using taskId
      const task = await ParentTaskApi.getTaskById(taskId); // Use existing wrapper
      if (task) {
        taskNameInput.val(task.task_name);
        taskDescriptionInput.val(task.task_description);
        taskGroupIdSelect.val(task.task_group_id); // Set dropdown value
        // Convert boolean/number 'enabled' to string 'true'/'false' for the select value
        taskEnabledSelect.val(
          String(task.enabled === true || task.enabled === 1).toLowerCase()
        );
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      handleError(error, `fetching task ${taskId} for editing`);
      taskModal.modal("hide"); // Hide modal if data loading fails
    }
  } else {
    // --- ADD MODE ---
    taskModalLabel.text("Create Task");
    // Set default values for Add mode if needed
    taskEnabledSelect.val("true"); // Default to 'Yes' (true) for new tasks
    // Optionally set a default group if applicable
    // taskGroupIdSelect.val(DEFAULT_GROUP_ID);
  }
}

// Handle Form Submission (Add or Edit)
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission
  const taskId = taskIdInput.val(); // Get ID from hidden input
  const isUpdating = !!taskId;
  const modeLabel = isUpdating ? "update" : "create";

  // Gather form data
  const taskData = {
    task_name: taskNameInput.val().trim(),
    task_description: taskDescriptionInput.val().trim(),
    task_group_id: taskGroupIdSelect.val(), // Keep as string or parse if API needs number
    // Convert string 'true'/'false' from select back to boolean/1/0 for API
    enabled: taskEnabledSelect.val() === "true", // Example: sending boolean
    // Or: enabled: taskEnabledSelect.val() === 'true' ? 1 : 0, // Example: sending 1/0
  };

  // Basic Validation
  if (!taskData.task_name || !taskData.task_group_id) {
    Swal.fire(
      "Validation Error",
      "Task Name and Task Group are required.",
      "warning"
    );
    return;
  }
  // Optional: Convert group ID to number if API expects it
  // taskData.task_group_id = parseInt(taskData.task_group_id, 10);
  // if (isNaN(taskData.task_group_id)) { /* handle error */ }

  // Disable button to prevent double submission
  saveTaskButton
    .prop("disabled", true)
    .html('<i class="fas fa-spinner fa-spin"></i> Saving...');

  try {
    if (isUpdating) {
      await ParentTaskApi.updateTask(taskId, taskData); // Use existing wrapper
    } else {
      await ParentTaskApi.createTask(taskData); // Use existing wrapper
    }

    Swal.fire(
      "Success",
      `Task ${isUpdating ? "updated" : "created"} successfully!`,
      "success"
    );
    taskModal.modal("hide"); // Close modal on success
    await renderTasks(); // Refresh the list
  } catch (error) {
    handleError(error, `${modeLabel} task`);
    // Keep modal open, re-enable button on error
    saveTaskButton.prop("disabled", false).html("Save Task");
  }
  // 'finally' block is not needed here as button state is reset above on error
}

// --- Event Listeners Setup ---
$(document).ready(async () => {
  // Make ready async

  // Populate static dropdowns
  // Use different default texts for filter vs modal if needed
  await populateDropdown("#filterTaskGroup", "task_group", "All Task Groups");
  await populateDropdown("#taskGroupId", "task_group", "Select a Group");

  // Initial Load
  await renderTasks();

  // Filter Button Click
  applyFilterBtn.on("click", renderTasks); // Re-render tasks applying filters

  // Modal Event Binding (using Bootstrap events)
  taskModal.on("show.bs.modal", handleModalOpen); // Setup form just before modal opens

  // Form Submission Binding
  taskForm.on("submit", handleFormSubmit);

  // Create Button triggers modal via data attributes, no separate listener needed unless for reset
  // $('.create-btn').click(function() { /* Only needed if manual reset before show is desired */ });

  // Edit Button triggers modal via data attributes, modal event handles population

  // Delete Button Listener (Example - requires deleteTask API function)
  /*
     taskTableBody.on('click', '.delete-btn', async function() {
         const taskId = $(this).data('task-id');
         const taskName = $(this).closest('tr').find('td:nth-child(2)').text(); // Get name for confirmation

         const result = await Swal.fire({
             title: `Delete Task: ${taskName}?`,
             text: "This will also delete associated subtasks and cannot be undone!",
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#d33',
             cancelButtonColor: '#6c757d',
             confirmButtonText: 'Yes, delete it!'
         });

         if (result.isConfirmed) {
             try {
                 // Assuming you have a deleteTask function in ParentTaskApi
                 // await ParentTaskApi.deleteTask(taskId);
                 Swal.fire('Deleted!', 'The task has been deleted.', 'success');
                 await renderTasks(); // Refresh list
             } catch (error) {
                 handleError(error, `deleting task ${taskId}`);
             }
         }
     });
     */
}); // End document ready
