import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskApi from "./services/childTaskServices.js";
import * as DocumentTaskApi from "./services/documentServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";

$(document).ready(async function () {
  const taskId = window.location.pathname.split("/").pop();

  async function populateTaskName() {
    const parent_task = await ParentTaskApi.getTaskById(taskId);

    $("#taskName").text(parent_task.task_name);
    $("#taskName").attr("data-id", parent_task.task_id);
  }

  // Populate the Document Dropdown
  async function populateDocumentDropdown() {
    const $documentDropdown = $("#documentId");
    $documentDropdown.empty(); // Clear existing options

    // Add the default "Select" option
    $documentDropdown.append(
      `<option value="" disabled selected>Select a document</option>`
    );

    const documents = await DocumentTaskApi.getTasks();
    // Populate dropdown with documents from mockdata.js
    documents.forEach((doc) => {
      $documentDropdown.append(
        `<option value="${doc.object_type_item_key}">${doc.object_type_item_value}</option>`
      );
    });
  }

  // Populate Device Type Dropdown
  async function populateDeviceTypeDropdown() {
    const $deviceDropdown = $("#deviceId");
    $deviceDropdown.empty(); // Clear existing options

    // Add the default "Select" option
    $deviceDropdown.append(
      `<option value="" disabled selected>Select a device type</option>`
    );

    // Filter only the "Equipment" object types and populate dropdown
    const equipment_types = await ObjectTypeApi.getTaskByName("equipment_type");
    equipment_types
      .filter((type) => type.object === "Equiptment")
      .forEach((device) => {
        $deviceDropdown.append(
          `<option value="${device.object_type_item_key}">${device.object_type_item_value}</option>`
        );
      });
  }

  // Populate Training Module Dropdown
  function populateTrainingModuleDropdown() {
    const $trainingDropdown = $("#trainingModuleId");
    $trainingDropdown.empty();

    // Add default option
    $trainingDropdown.append(
      `<option value="" disabled selected>Select a training module</option>`
    );
    const training_modules = [];
    // Populate options from training_modules array
    training_modules.forEach((module) => {
      $trainingDropdown.append(
        `<option value="${module.id}">${module.training_name}</option>`
      );
    });
  }

  // Populate Interview Dropdown
  function populateInterviewDropdown() {
    const $interviewDropdown = $("#interviewId");
    $interviewDropdown.empty();

    // Add default option
    $interviewDropdown.append(
      `<option value="" disabled selected>Select an interview</option>`
    );

    const interviews = [];
    // Populate options from interviews array
    interviews.forEach((interview) => {
      $interviewDropdown.append(
        `<option value="${interview.id}">${interview.interview_name}</option>`
      );
    });
  }

  // Populate Survey Dropdown
  function populateSurveyDropdown() {
    const $surveyDropdown = $("#surveyId");
    $surveyDropdown.empty();

    // Add default option
    $surveyDropdown.append(
      `<option value="" disabled selected>Select a survey</option>`
    );

    const surveys = [];
    // Populate options from surveys array
    surveys.forEach((survey) => {
      $surveyDropdown.append(
        `<option value="${survey.id}">${survey.survey_name}</option>`
      );
    });
  }

  // Populate Subtask Table
  async function populateTable() {
    const tableBody = $("#subtaskTable tbody");
    tableBody.empty();

    const parent_task_id = $("#taskName").attr("data-id");
    if (!parent_task_id) {
      console.error("Parent Task ID is missing.");
      return;
    }

    try {
      const subtasks = await ChildTaskApi.getTaskByParentTaskId(parent_task_id);
      const documents = await DocumentTaskApi.getTasks();
      const equipmentTypes = await ObjectTypeApi.getTaskByName(
        "equipment_type"
      );

      subtasks.forEach((subtask) => {
        const document =
          documents.find((doc) => doc.document_id === subtask.document_id) ??
          null;
        const equipment_type =
          equipmentTypes.find(
            (eqpt) => eqpt.object_type_item_key == subtask.equiptment_type_id
          ) ?? null;

        // Default Values if Data is Null
        const subtask_name = subtask.subtask_name ?? "N/A";
        const subtask_description = subtask.subtask_description ?? "N/A";
        const document_status = document ? "N/A" : "NULL";
        const require_upload = document?.require_upload
          ? `<button class="btn btn-secondary btn-sm upload-btn" data-id="${subtask.child_task_id}">Upload File</button>`
          : "";
        const equipment_status = equipment_type ? "N/A" : "NULL";
        const trainingModule = "N/A";
        const interview = "N/A";
        const survey = "N/A";
        const created_date = subtask.created_date ?? "N/A";
        const last_updated_date = subtask.last_updated_date ?? "N/A";
        const enable_status = subtask.enable ?? "N/A";

        // Append Row to Table
        tableBody.append(`
          <tr>
            <td>${subtask.child_task_id ?? "N/A"}</td>
            <td>${subtask_name}</td>
            <td>${subtask_description}</td>
            <td>${document_status}</td>
            <td>${require_upload}</td>
            <td>${equipment_status}</td>
            <td>${trainingModule}</td>
            <td>${interview}</td>
            <td>${survey}</td>
            <td>${created_date}</td>
            <td>${last_updated_date}</td>
            <td>${enable_status}</td>
            <td>
              <button data-id="${
                subtask.child_task_id ?? ""
              }" class="btn btn-sm btn-warning edit data-mode="edit"">Edit</button>
            </td>
          </tr>
        `);
      });
    } catch (error) {
      console.error("Error populating table:", error);
    }
  }
  // Reset Form Fields
  function resetForm() {
    $("#subtaskId").val("");
    $("#subtaskName").val("");
    $("#subtaskDescription").val("");
    $("#documentId").val("");
    $("#deviceId").val("");
    $("#fileRequirement").val("Yes");
    $("#trainingModuleId").val("");
    $("#interviewId").val("");
    $("#surveyId").val("");
    $("#enable").val("true");
  }

  // Save or Update Subtask
  $("#saveSubtask").click(async function () {
    const mode = $(this).data("mode"); // Check if the button is in "add" or "edit" mode

    const subtask = {
      child_task_id: $("#subtaskId").val() || null,
      child_task_name: $("#subtaskName").val() || null,
      child_task_description: $("#subtaskDescription").val() || null,
      document_id: $("#documentId").val() || null,
      equipment_type_id: $("#deviceId").val() || null,
      access_provisioning_id: $("#fileRequirement").val() || null,
      training_module_id: $("#trainingModuleId").val() || null,
      interview_id: $("#interviewId").val() || null,
      survey_id: $("#surveyId").val() || null,
      enable: $("#enable").val() === "true",
    };
 
    if (!subtask.child_task_name) {
      alert("Please fill in all required fields.");
      return;
    }

    if (mode === "add") {
      // Add new subtask
      await ChildTaskApi.createTask(subtask);
    } else if (mode === "edit") {
      // Update existing subtask
      const existingSubtask = await ChildTaskApi.getTaskById(subtask.child_task_id);
      if (existingSubtask) {
        Object.assign(existingSubtask, subtask);
      }
    }

    populateTable();
    resetForm();
    $("#addSubtaskModal").modal("hide");
    $(".modal-backdrop").remove(); // Ensure the shadow (backdrop) is removed
    $("body").removeClass("modal-open"); // Remove class preventing scrolling
  });

  // Open Modal for Adding a Subtask
  $("#addSubtaskButton").click(function () {
    resetForm();
    $("#saveSubtask").data("mode", "add"); // Set mode to "add"
    $("#addSubtaskModal").modal("show");
  });

  // Open Modal for Editing a Subtask
  $(document).on("click", ".edit", async function () {
    const subtaskId = $(this).data("id");
    const subtask = await ChildTaskApi.getTaskById(subtaskId);

    if (subtask) {
      $("#subtaskId").val(subtask.child_task_id);
      $("#subtaskName").val(subtask.child_task_name);
      $("#subtaskDescription").val(subtask.child_task_description);
      $("#documentId").val(subtask.document_id);
      $("#deviceId").val(subtask.equipment_type_id);
      // $("#fileRequirement").val(subtask.u);
      $("#trainingModuleId").val(subtask.training_module_id);
      $("#interviewId").val(subtask.interview_id);
      $("#surveyId").val(subtask.survey_id);
      //handover is
      $("#enable").val(subtask.enabled ? "true" : "false");

      $("#saveSubtask").data("mode", "edit"); // Set mode to "edit"
      $("#addSubtaskModal").modal("show");
    }
  });

  // Initialize
  await populateTaskName();
  await populateTable();
  await populateDocumentDropdown();
  await populateDeviceTypeDropdown();
  await populateTrainingModuleDropdown();
  await populateInterviewDropdown();
  await populateSurveyDropdown();
});
