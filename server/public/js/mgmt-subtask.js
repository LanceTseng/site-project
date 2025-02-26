import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskApi from "./services/childTaskServices.js";
import * as DocumentApi from "./services/documentServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ChildTaskView from "./services/chilsTaskViewServices.js";
import * as FormDesignViewApi from "./services/formDesignViewServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

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

    const documents = await DocumentApi.getTasks();
    // Populate dropdown with documents from mockdata.js
    documents.forEach((doc) => {
      $documentDropdown.append(
        `<option value="${doc.document_id}">${doc.document_name}</option>`
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
    equipment_types.forEach((device) => {
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
  async function populateSurveyDropdown() {
    const $surveyDropdown = $("#surveyId");
    $surveyDropdown.empty();

    // Add default option
    $surveyDropdown.append(
      `<option value="" disabled selected>Select a survey</option>`
    );

    const surveys =
      await FormDesignViewApi.getFormDesignViewFormTypeByFormTypeId();
    // Populate options from surveys array
    surveys.forEach((survey) => {
      $surveyDropdown.append(
        `<option value="${survey.form_id}">${survey.form_name}</option>`
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
      const subtasks = await ChildTaskView.getChildTaskByParentId(
        parent_task_id
      );

      subtasks.forEach((subtask) => {
        // Append Row to Table
        tableBody.append(`
          <tr>
            <td>${subtask.child_task_id}</td>
            <td>${subtask.child_task_name}</td>
            <td>${subtask.child_task_description}</td>
            <td>${subtask.document_name ?? ""}</td>
            <td>${subtask.require_upload ? "Y" : "N"}</td>
            <td>${subtask.eqpt_type ?? ""}</td>
            <td>${subtask.training_module_id ?? ""}</td>
            <td>${subtask.interview_id ?? ""}</td>
            <td>${subtask.servey_name ?? ""}</td>
            <td>${subtask.enabled ? "Yes" : "No"}</td>
            <td>
              <button data-id="${
                subtask.child_task_id ?? ""
              }" class="btn btn-sm btn-info edit data-mode="edit">Edit</button>
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
    $("#fileRequirement").val("");
    $("#trainingModuleId").val("");
    $("#interviewId").val("");
    $("#surveyId").val("");
    $("#enable").val("true");
  }

  // Save or Update Subtask
  $("#saveSubtask").click(async function () {
    const mode = $("#saveSubtask").data("mode"); // Check if the button is in "add" or "edit" mode

    try {
      const subtask = {
        child_task_id: $("#subtaskId").val() || null,
        parent_task_id: $("#taskName").attr("data-id"),
        child_task_name: $("#subtaskName").val() || null,
        child_task_description: $("#subtaskDescription").val() || null,
        document_id: $("#documentId").val() || null,
        training_module_id: $("#trainingModuleId").val() || null,
        equipment_type_id: $("#deviceId").val() || null,
        access_provisioning_id: null,
        interview_id: $("#interviewId").val() || null,
        survey_id: $("#surveyId").val() || null,
        hand_over_id: null,
        enabled: $("#enable").val() === "true",
      };
      console.log(subtask);
      if (!subtask.child_task_name) {
        Swal.fire("Error", `Please fill in all required fields.`, "error");
        return;
      }

      if (mode === "add") {
        // Add new subtask
        await ChildTaskApi.createTask(subtask);
      } else if (mode === "edit") {
        // Update existing subtask
        const existingSubtask = await ChildTaskApi.getTaskById(
          subtask.child_task_id
        );
        if (existingSubtask) {
          Object.assign(existingSubtask, subtask);
        }
        await ChildTaskApi.updateTask(subtask.child_task_id, subtask);
      }

      Swal.fire("Success", `Equipment ${mode}ed successfully!`, "success");

      populateTable();
      resetForm();
      $("#addSubtaskModal").modal("hide");
      // $(".modal-backdrop").remove(); // Ensure the shadow (backdrop) is removed
      // $("body").removeClass("modal-open"); // Remove class preventing scrolling
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", `Failed to ${mode}ed subtask!`, "error");
    }
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
    const subtask = await ChildTaskView.getChildTaskById(subtaskId);

    console.log(subtask);

    if (subtask) {
      $("#subtaskId").val(subtask.child_task_id);
      $("#subtaskName").val(subtask.child_task_name);
      $("#subtaskDescription").val(subtask.child_task_description);
      $("#documentId").val(subtask.document_id);
      $("#deviceId").val(subtask.equipment_type_id);
      $("#fileRequirement").val(subtask.require_upload);
      $("#trainingModuleId").val(subtask.training_module_id);
      $("#interviewId").val(subtask.interview_id);
      $("#surveyId").val(subtask.survey_id);
      //handover is
      $("#enable").val(subtask.enabled ? "true" : "false");

      $("#saveSubtask").data("mode", "edit"); // Set mode to "edit"
      $("#addSubtaskModal").modal("show");
    }
  });

  $("#documentId").on("change", async function () {
    const docId = $("#documentId").val();

    const document = await DocumentApi.getTaskById(docId);
    $("#fileRequirement").val(document.require_upload);
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
