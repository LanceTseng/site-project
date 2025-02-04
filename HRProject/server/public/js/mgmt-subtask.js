// Mock Subtask Data
import {
  subtasks,
  object_type,
  training_modules,
  interviews,
  surveys,
  tasks,
} from "./mockdata.js"; // Adjust the path as necessary

import { documents } from "./mockdata2.js";

$(document).ready(function () {
  const taskId = window.location.pathname.split("/").pop();

  function populateTaskName() {
    const task = tasks.find((t) => t.id == taskId);
    const taskName = task ? task.task_name : "N/A";

    $("#taskName").text(taskName);
  }

  // Populate the Document Dropdown
  function populateDocumentDropdown() {
    const $documentDropdown = $("#documentId");
    $documentDropdown.empty(); // Clear existing options

    // Add the default "Select" option
    $documentDropdown.append(
      `<option value="" disabled selected>Select a document</option>`
    );

    // Populate dropdown with documents from mockdata.js
    documents.forEach((doc) => {
      $documentDropdown.append(
        `<option value="${doc.id}">${doc.document_name}</option>`
      );
    });
  }

  // Populate Device Type Dropdown
  function populateDeviceTypeDropdown() {
    const $deviceDropdown = $("#deviceId");
    $deviceDropdown.empty(); // Clear existing options

    // Add the default "Select" option
    $deviceDropdown.append(
      `<option value="" disabled selected>Select a device type</option>`
    );

    // Filter only the "Equipment" object types and populate dropdown
    object_type
      .filter((type) => type.object === "Equiptment")
      .forEach((device) => {
        $deviceDropdown.append(
          `<option value="${device.id}">${device.object_type}</option>`
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

    // Populate options from surveys array
    surveys.forEach((survey) => {
      $surveyDropdown.append(
        `<option value="${survey.id}">${survey.survey_name}</option>`
      );
    });
  }

  // Populate Subtask Table
  function populateTable() {
    const $tableBody = $("#subtaskTable tbody");
    $tableBody.empty();

    subtasks.forEach((subtask) => {
      if (subtask.task_id == taskId) {
        const document = documents.find(
          (doc) => doc.id === subtask.document_id
        );
        const device = object_type.find(
          (eqpt) =>
            eqpt.object === "Equiptment" && eqpt.id == subtask.device_type_id
        );
        const trainingModule = training_modules.find(
          (mod) => mod.id == subtask.training_module_id
        );
        const interview = interviews.find(
          (int) => int.id == subtask.interview_id
        );
        const survey = surveys.find((surv) => surv.id == subtask.survey_id);

        $tableBody.append(`
          <tr>
            <td>${subtask.id}</td>
            <td>${subtask.subtask_name}</td>
            <td>${subtask.subtask_description}</td>
            <td>${document ? document.document_name : "N/A"}</td>
            <td>
              ${
                document.docuument_upload
                  ? '<button class="btn btn-secondary btn-sm upload-btn">Upload File</button>'
                  : ""
              }
            </td>
            <td>${device ? device.object_type : "N/A"}</td>
            <td>${trainingModule ? trainingModule.training_name : "N/A"}</td>
            <td>${interview ? interview.interview_name : "N/A"}</td>
            <td>${survey ? survey.survey_name : "N/A"}</td>
            <td>${subtask.created_date}</td>
            <td>${subtask.last_updated_date}</td>
            <td>${subtask.enable}</td>
            <td>
              <button data-id="${
                subtask.id
              }" class="btn btn-sm btn-warning edit">Edit</button>
            </td>
          </tr>
        `);
      }
    });
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
  $("#saveSubtask").click(function () {
    const mode = $(this).data("mode"); // Check if the button is in "add" or "edit" mode
    const subtaskId = $("#subtaskId").val();

    const subtask = {
      id: subtaskId || subtasks.length() + 1,
      subtask_name: $("#subtaskName").val(),
      subtask_description: $("#subtaskDescription").val(),
      document_id: $("#documentId").val(),
      device_type_id: $("#deviceId").val(),
      upload_file_requirement: $("#fileRequirement").val(),
      training_module_id: $("#trainingModuleId").val(),
      interview_id: $("#interviewId").val(),
      survey_id: $("#surveyId").val(),
      created_date: new Date().toISOString(),
      last_updated_date: new Date().toISOString(),
      enable: $("#enable").val() === "true",
    };

    if (!subtask.subtask_name || !subtask.subtask_description) {
      alert("Please fill in all required fields.");
      return;
    }

    if (mode === "add") {
      // Add new subtask
      subtasks.push(subtask);
    } else if (mode === "edit") {
      // Update existing subtask
      const existingSubtask = subtasks.find((item) => item.id == subtaskId);
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
  $(document).on("click", ".edit", function () {
    const subtaskId = $(this).data("id");
    const subtask = subtasks.find((item) => item.id == subtaskId);

    if (subtask) {
      $("#subtaskId").val(subtask.id);
      $("#subtaskName").val(subtask.subtask_name);
      $("#subtaskDescription").val(subtask.subtask_description);
      $("#documentId").val(subtask.document_id);
      $("#deviceId").val(subtask.device_type_id);
      $("#fileRequirement").val(subtask.upload_file_requirement);
      $("#trainingModuleId").val(subtask.training_module_id);
      $("#interviewId").val(subtask.interview_id);
      $("#surveyId").val(subtask.survey_id);
      $("#enable").val(subtask.enable ? "true" : "false");

      $("#saveSubtask").data("mode", "edit"); // Set mode to "edit"
      $("#addSubtaskModal").modal("show");
    }
  });

  // Initialize
  populateTable();
  populateDocumentDropdown();
  populateDeviceTypeDropdown();
  populateTrainingModuleDropdown();
  populateInterviewDropdown();
  populateSurveyDropdown();
  populateTaskName();
});
