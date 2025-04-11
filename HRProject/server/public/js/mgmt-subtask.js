import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskApi from "./services/childTaskServices.js";
import * as DocumentApi from "./services/documentServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ChildTaskViewApi from "./services/chilsTaskViewServices.js"; // Corrected potential typo
import * as FormDesignViewApi from "./services/formDesignViewServices.js";
// isEqualIgnoreCase not used, formatDate used
import { formatDate } from "./utils/stringUtils.js";

// --- DOM Element References ---
const parentTaskIdInput = $("#parentTaskId");
const taskNameDisplay = $("#taskNameDisplay");
const addSubtaskButton = $("#addSubtaskButton"); // Trigger for Add modal
const backToTaskBtn = $("#backToTaskBtn");

const subtaskTableBody = $("#subtaskTableBody");
const tableFooter = $("#tableFooter");

const subtaskModal = $("#subtaskModal");
const subtaskModalLabel = $("#subtaskModalLabel");
const subtaskForm = $("#subtaskForm");
const subtaskIdInput = $("#subtaskId"); // Hidden input for Subtask ID
const subtaskNameInput = $("#subtaskName");
const subtaskDescriptionInput = $("#subtaskDescription");
const documentIdSelect = $("#documentId");
const fileRequirementSelect = $("#fileRequirement");
const deviceIdSelect = $("#deviceId");
const trainingModuleIdSelect = $("#trainingModuleId");
const surveyIdSelect = $("#surveyId");
const handoverIdSelect = $("#handoverId");
const enabledSelect = $("#enabled");
const saveSubtaskBtn = $("#saveSubtaskBtn"); // Submit button linked to form

// --- Helper Functions ---
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

// Consolidated Dropdown Population
async function populateGenericDropdown(
  dropdownId,
  apiFunction,
  valueField,
  textField,
  defaultOptionText = "None",
  allowNone = true
) {
  const $dropdown = $(dropdownId);
  $dropdown.empty().prop("disabled", true); // Disable while loading

  if (allowNone) {
    $dropdown.append(`<option value="">${defaultOptionText}</option>`);
  } else {
    $dropdown.append(
      `<option value="" disabled selected>${defaultOptionText}</option>`
    ); // Prompt selection if None not allowed
  }

  try {
    const items = await apiFunction(); // Call the provided API function
    if (items && items.length > 0) {
      items.forEach((item) => {
        $dropdown.append(
          // Use bracket notation to access fields by variable name
          `<option value="${item[valueField]}">${item[textField]}</option>`
        );
      });
    }
    $dropdown.prop("disabled", false); // Re-enable after loading
  } catch (error) {
    handleError(error, `populating dropdown ${dropdownId}`);
    $dropdown.append(`<option value="">Error loading</option>`);
    // Keep disabled on error
  }
}

// --- Data Loading and Rendering ---

// Fetch Parent Task Info and set page title/ID
async function loadParentTaskInfo(parentTaskId) {
  if (!parentTaskId) {
    handleError(
      new Error("Parent Task ID missing from URL"),
      "loading parent task info"
    );
    taskNameDisplay.text("(Error: Missing Task ID)");
    return false; // Indicate failure
  }
  parentTaskIdInput.val(parentTaskId); // Store parent ID in hidden input

  try {
    const parentTask = await ParentTaskApi.getTaskById(parentTaskId);
    taskNameDisplay.text(parentTask.task_name || "(Unknown Task)");
    return true; // Indicate success
  } catch (error) {
    handleError(error, `loading parent task info for ID ${parentTaskId}`);
    taskNameDisplay.text("(Error Loading Task Name)");
    return false; // Indicate failure
  }
}

// Render Subtask List
async function renderSubtasks() {
  const parentTaskId = parentTaskIdInput.val();
  if (!parentTaskId) {
    subtaskTableBody
      .empty()
      .html(
        '<tr><td colspan="11" class="text-center text-danger">Parent Task ID not set. Cannot load subtasks.</td></tr>'
      );
    tableFooter.text("Error");
    return;
  }

  subtaskTableBody
    .empty()
    .html(
      '<tr><td colspan="11" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading subtasks...</td></tr>'
    );
  tableFooter.text("Loading...");

  try {
    const subtasks = await ChildTaskViewApi.getChildTaskByParentId(
      parentTaskId
    );

    subtaskTableBody.empty(); // Clear loading spinner

    if (!subtasks || subtasks.length === 0) {
      subtaskTableBody.append(
        '<tr><td colspan="11" class="text-center text-muted">No subtasks found for this task.</td></tr>'
      );
      tableFooter.text("0 subtasks found.");
      return;
    }

    subtasks.forEach((subtask) => {
      // Standardize boolean checks
      const isUploadRequired =
        subtask.require_upload === true || subtask.require_upload === 1;
      const isHandover =
        subtask.hand_over_id === true || subtask.hand_over_id === 1; // Assuming 1 means Yes for handover
      const isEnabled = subtask.enabled === true || subtask.enabled === 1;

      const enabledBadge = isEnabled
        ? '<span class="badge badge-success">Yes</span>'
        : '<span class="badge badge-danger">No</span>';
      const uploadBadge = isUploadRequired
        ? '<span class="badge badge-primary">Yes</span>'
        : '<span class="badge badge-secondary">No</span>';
      const handoverBadge = isHandover
        ? '<span class="badge badge-primary">Yes</span>'
        : '<span class="badge badge-secondary">No</span>';

      const row = `
            <tr data-subtask-id="${subtask.child_task_id}">
                <td>${subtask.child_task_id}</td>
                <td>${subtask.child_task_name || ""}</td>
                <td>${subtask.child_task_description || ""}</td>
                <td>${subtask.document_name || "None"}</td>
                <td class="text-center">${uploadBadge}</td>
                <td>${subtask.eqpt_type || "None"}</td>
                <td>${subtask.training_module_dept_name || "None"}</td>
                <td class="text-center">${handoverBadge}</td>
                <td>${
                  subtask.servey_name || "None"
                }</td> {/* Corrected typo from survey -> servey in original */}
                <td class="text-center">${enabledBadge}</td>
                <td class="text-center">
                    <button class="btn btn-info btn-sm edit-btn" title="Edit Subtask"
                            data-toggle="modal" data-target="#subtaskModal" data-subtask-id="${
                              subtask.child_task_id
                            }">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                     <!-- Optional Delete Button
                     <button class="btn btn-danger btn-sm delete-btn" title="Delete Subtask" data-subtask-id="${
                       subtask.child_task_id
                     }">
                         <i class="fas fa-trash-alt"></i>
                     </button>
                     -->
                </td>
            </tr>
            `;
      subtaskTableBody.append(row);
    });
    tableFooter.text(`${subtasks.length} subtask(s) found.`);
  } catch (error) {
    handleError(error, `rendering subtasks for parent ID ${parentTaskId}`);
    subtaskTableBody
      .empty()
      .html(
        '<tr><td colspan="11" class="text-center text-danger">Error loading subtasks.</td></tr>'
      );
    tableFooter.text("Error loading.");
  }
}

// --- Modal and Form Handling ---

// Handle Modal Opening (for Add and Edit)
async function handleModalOpen(event) {
  const button = $(event.relatedTarget); // Button that triggered the modal
  const subtaskId = button.data("subtask-id"); // Extract subtask ID
  const modal = $(this); // The modal itself

  subtaskForm[0].reset(); // Reset form first
  subtaskIdInput.val(""); // Clear hidden ID

  // Reset button state
  saveSubtaskBtn.prop("disabled", false).html("Save Subtask");

  if (subtaskId) {
    // --- EDIT MODE ---
    subtaskModalLabel.text("Edit Subtask");
    subtaskIdInput.val(subtaskId);

    try {
      // Fetch detailed subtask data using the VIEW service if it has all needed IDs
      const subtask = await ChildTaskViewApi.getChildTaskById(subtaskId); // Or use ChildTaskApi.getTaskById if view lacks IDs
      if (subtask) {
        subtaskNameInput.val(subtask.child_task_name);
        subtaskDescriptionInput.val(subtask.child_task_description);
        documentIdSelect.val(subtask.document_id || ""); // Use empty string for 'None'
        fileRequirementSelect.val(
          String(
            subtask.require_upload === true || subtask.require_upload === 1
          ).toLowerCase()
        ); // bool string
        deviceIdSelect.val(subtask.equipment_type_id || "");
        trainingModuleIdSelect.val(subtask.training_module_id || "");
        surveyIdSelect.val(subtask.survey_id || ""); // Assuming view has survey_id
        // Use boolean string for handover select (assuming 1=true/Yes, 0=false/No)
        handoverIdSelect.val(
          String(
            subtask.hand_over_id === true || subtask.hand_over_id === 1
          ).toLowerCase()
        );
        // Use boolean string for enabled select
        enabledSelect.val(
          String(
            subtask.enabled === true || subtask.enabled === 1
          ).toLowerCase()
        );
      } else {
        throw new Error("Subtask not found");
      }
    } catch (error) {
      handleError(error, `fetching subtask ${subtaskId} for editing`);
      subtaskModal.modal("hide"); // Close modal on error
    }
  } else {
    // --- ADD MODE ---
    subtaskModalLabel.text("Add Subtask");
    // Set default values for ADD mode
    fileRequirementSelect.val("false"); // Default No
    handoverIdSelect.val("false"); // Default No
    enabledSelect.val("true"); // Default Yes
  }
}

// Handle Form Submission (Add or Edit)
async function handleFormSubmit(event) {
  event.preventDefault();
  const subtaskId = subtaskIdInput.val();
  const parentTaskId = parentTaskIdInput.val();
  const isUpdating = !!subtaskId;
  const modeLabel = isUpdating ? "update" : "create";

  if (!parentTaskId) {
    Swal.fire("Error", "Parent Task ID is missing. Cannot save.", "error");
    return;
  }

  // Gather form data
  const subtaskData = {
    parent_task_id: parentTaskId, // Always include parent ID
    child_task_name: subtaskNameInput.val().trim(),
    child_task_description: subtaskDescriptionInput.val().trim(),
    // Use || null to send null if dropdown value is empty string ""
    document_id: documentIdSelect.val() || null,
    require_upload: fileRequirementSelect.val() === "true", // Convert to boolean
    equipment_type_id: deviceIdSelect.val() || null,
    training_module_id: trainingModuleIdSelect.val() || null,
    survey_id: surveyIdSelect.val() || null,
    // Convert handover 'true'/'false' string to 1/0 or boolean based on API need
    hand_over_id: handoverIdSelect.val() === "true", // Example: Sending boolean
    // Or: hand_over_id: handoverIdSelect.val() === 'true' ? 1 : 0, // Example: Sending 1/0
    enabled: enabledSelect.val() === "true", // Convert to boolean

    // Set other fields to null if they are not in the form or should be defaulted
    access_provisioning_id: null, // Example, adjust as needed
    interview_id: null, // Example, adjust as needed
  };

  // Validation
  if (!subtaskData.child_task_name) {
    // Add more required field checks if necessary
    Swal.fire("Validation Error", "Subtask Name is required.", "warning");
    return;
  }

  // Disable button
  saveSubtaskBtn
    .prop("disabled", true)
    .html('<i class="fas fa-spinner fa-spin"></i> Saving...');

  try {
    if (isUpdating) {
      // Important: Send subtaskId separately for the update endpoint
      await ChildTaskApi.updateTask(subtaskId, subtaskData);
    } else {
      // Create endpoint likely just needs the data payload
      await ChildTaskApi.createTask(subtaskData);
    }

    Swal.fire(
      "Success",
      `Subtask ${isUpdating ? "updated" : "created"} successfully!`,
      "success"
    );
    subtaskModal.modal("hide"); // Close modal on success
    await renderSubtasks(); // Refresh the list
  } catch (error) {
    handleError(error, `${modeLabel} subtask`);
    // Keep modal open, re-enable button
    saveSubtaskBtn.prop("disabled", false).html("Save Subtask");
  }
}

// --- Event Listeners Setup ---
$(document).ready(async () => {
  // Make ready async

  // Get Parent Task ID from URL
  const parentTaskIdFromUrl = window.location.pathname.split("/").pop();

  // Initial Load - MUST load parent info first
  const parentInfoLoaded = await loadParentTaskInfo(parentTaskIdFromUrl);

  if (parentInfoLoaded) {
    // Populate dropdowns needed for the modal
    // Use the consolidated function
    await Promise.all([
      populateGenericDropdown(
        "#documentId",
        DocumentApi.getTasks,
        "document_id",
        "document_name",
        "None"
      ), // Assuming getTasks returns list
      populateGenericDropdown(
        "#deviceId",
        () => ObjectTypeApi.getTaskByName("equipment_type"),
        "object_type_item_key",
        "object_type_item_value",
        "None"
      ),
      populateGenericDropdown(
        "#trainingModuleId",
        () => ObjectTypeApi.getTaskByName("training_department"),
        "object_type_item_key",
        "object_type_item_value",
        "None"
      ),
      // Ensure FormDesignViewApi function returns the correct structure
      populateGenericDropdown(
        "#surveyId",
        () => FormDesignViewApi.getFormDesignViewFormTypeByFormTypeId(),
        "form_id",
        "form_name",
        "None"
      ), // Adjust form_id/form_name if needed
    ]);

    // Load subtasks for the parent task
    await renderSubtasks();
  } else {
    // Handle case where parent task couldn't be loaded (error already shown)
    tableFooter.text("Cannot load subtasks - Parent task error.");
    // Disable add button if parent task is invalid?
    addSubtaskButton.prop("disabled", true);
  }

  // Modal Event Binding
  subtaskModal.on("show.bs.modal", handleModalOpen);

  // Form Submission Binding
  subtaskForm.on("submit", handleFormSubmit);

  // --- Optional: Listener for Document Change to potentially set Upload Requirement ---
  // This replaces the original simple listener, making it more robust
  documentIdSelect.on("change", async function () {
    const docId = $(this).val();
    if (docId) {
      try {
        const document = await DocumentApi.getTaskById(docId);
        // Set based on fetched document, convert boolean/1/0 to string 'true'/'false'
        fileRequirementSelect.val(
          String(
            document.require_upload === true || document.require_upload === 1
          ).toLowerCase()
        );
      } catch (error) {
        console.error(
          `Error fetching document ${docId} details on change:`,
          error
        );
        // Optionally revert fileRequirementSelect or show a small inline warning
        // fileRequirementSelect.val('false'); // Default back to No on error?
      }
    } else {
      // If "None" is selected for document, reset file requirement to No (or default)
      fileRequirementSelect.val("false");
    }
  });

  // --- Optional: Delete Button Listener ---
  /*
     subtaskTableBody.on('click', '.delete-btn', async function() {
         const subtaskId = $(this).data('subtask-id');
         const subtaskName = $(this).closest('tr').find('td:nth-child(2)').text();

         const result = await Swal.fire({
             title: `Delete Subtask: ${subtaskName}?`,
             text: "This action cannot be undone!",
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#d33',
             cancelButtonColor: '#6c757d',
             confirmButtonText: 'Yes, delete it!'
         });

         if (result.isConfirmed) {
             try {
                 // Assuming you have a deleteTask function in ChildTaskApi
                 // await ChildTaskApi.deleteTask(subtaskId);
                 Swal.fire('Deleted!', 'The subtask has been deleted.', 'success');
                 await renderSubtasks(); // Refresh list
             } catch (error) {
                 handleError(error, `deleting subtask ${subtaskId}`);
             }
         }
     });
     */
}); // End document ready
