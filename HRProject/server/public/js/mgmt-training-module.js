import * as TrainingModuleApi from "./services/trainingModuleServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";

import { accessVerify } from "./utils/authVerify.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

async function populateDropdown(dropdownId, taskName) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];

    // Add an empty option as the first item
    const options =
      `<option value="">-- Select --</option>` +
      items
        .map(
          (item) =>
            `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
        )
        .join("");

    $(dropdownId).html(options);
  } catch (error) {
    handleError(error, `Error populating ${taskName} dropdown`);
  }
}

function addTDTag(element, id) {
  return `<td id="text-${id}">${element}</td>`;
}

function addDropdown(list, selectedItem, id) {
  let options = `<option value="" ${
    selectedItem == null ? "selected" : ""
  }>Select an option</option>`;

  options += list
    .map((v) => {
      const attrSelected =
        selectedItem == v.object_type_item_key ? "selected" : "";
      return `<option value="${v.object_type_item_key}" ${attrSelected}>${v.object_type_item_value}</option>`;
    })
    .join("");

  return `<select class="form-control" id="input-${id}" disabled>${options}</select>`;
}

function addInputText(value, elementId) {
  return `<input
                  type="text"
                  id="input-${elementId}"
                  class="form-control"
                  value="${value ?? ""}" 
                  disabled
                />`;
}

async function loadTrainingModule() {
  try {
    const searchName = $("#searchName").val() ?? "";
    const searchDepartment = $("#searchDepartment").val() ?? "";
    const searchEnabled = $("#searchEnabled").val() ?? "";

    const response = await TrainingModuleApi.getTrainingModuleViewByCondition({
      name: searchName,
      department_id: searchDepartment,
      status: searchEnabled,
    });

    const trainingTableBody = $("#trainingTableBody");
    trainingTableBody.empty();

    const trainingModuleDepartment = await ObjectTypeApi.getTaskByName(
      "training_department"
    );

    const yesnoDropDown = [
      { object_type_item_key: 1, object_type_item_value: "Yes" },
      { object_type_item_key: 0, object_type_item_value: "No" },
    ];

    const rows = await Promise.all(
      response.map(async (training) => {
        const trainingModuleIdField = addTDTag(
          addInputText(training.training_module_name, "TrainingName")
        );
        const trainingModuleNameField = addTDTag(
          addInputText(training.training_module_description, "TrainingDesc")
        );
        const trainingDepartment = addTDTag(
          addDropdown(
            trainingModuleDepartment,
            training.training_department_id,
            "TrainingModuleDepartment"
          )
        );
        const trainingEnabled = addTDTag(
          addDropdown(yesnoDropDown, training.enabled, "Enabled")
        );

        // Action buttons (Edit & Save) with event binding
        const actionField = `<td>
         <button class="btn btn-warning btn-sm mx-1 edit-btn" data-id="${
           training.training_module_id ?? "-1"
         }">Edit</button>
         <button class="btn btn-dark btn-sm mx-1 save-btn" data-id="${
           training.training_module_id ?? "-1"
         }" disabled>Save</button>
       </td>`;

        return `<tr data-id="${training.training_module_id ?? "-1"}">
          ${trainingModuleIdField}
          ${trainingModuleNameField}
          ${trainingDepartment}
          ${trainingEnabled}
          ${actionField}
        </tr>`;
      })
    );
    trainingTableBody.append(rows.join(""));
  } catch (error) {
    console.error("Error loading payments:", error);
    Swal.fire("Error", error.message, "error");
  }
}

function editField(row) {
  row.find("input, select").prop("disabled", false); // Enable form fields
  row.find(".save-btn").prop("disabled", false); // Enable Save button
}

async function addField() {
  const trainingTableBody = $("#trainingTableBody");

  const trainingModuleDepartment = await ObjectTypeApi.getTaskByName(
    "training_department"
  );

  const newRow = `
    <tr data-id="-1">
      <td>${addInputText("", "TrainingName")}</td>
      <td>${addInputText("", "TrainingDesc")}</td>
      <td>${addDropdown(
        trainingModuleDepartment,
        null,
        "TrainingModuleDepartment"
      )}</td>
      <td>${addDropdown(
        [
          { object_type_item_key: 1, object_type_item_value: "Yes" },
          { object_type_item_key: 0, object_type_item_value: "No" },
        ],
        null,
        "Enabled"
      )}</td>
      <td>
        <button class="btn btn-warning btn-sm mx-1 edit-btn" data-id="-1">Edit</button>
        <button class="btn btn-dark btn-sm mx-1 save-btn" data-id="-1" disabled>Save</button>
      </td>
    </tr>
  `;

  trainingTableBody.append(newRow);
  const lastRow = trainingTableBody.find("tr:last");

  // Enable the new row fields for editing
  editField(lastRow);
}
 

$(document).ready(function () {

  populateDropdown("#searchDepartment", "training_department");
  // Your code here
  loadTrainingModule();

  $("#trainingTableBody").on("click", ".edit-btn", function () {
    const row = $(this).closest("tr");
    editField(row);
  });

  $("#trainingTableBody").on("click", ".save-btn", async function () {
    const row = $(this).closest("tr");
    const trainingId = $(this).data("id");

    const updateTrainingModel = {
      id: trainingId,
      training_module_name: row.find("#input-TrainingName").val().trim(),
      training_module_description: row.find("#input-TrainingDesc").val().trim(),
      training_department_id: row
        .find("#input-TrainingModuleDepartment")
        .val()
        .trim(),
      enabled: row.find("#input-Enabled").val().trim(),
    };

    try {
      if (trainingId == -1) {
        console.log(updateTrainingModel);
        delete updateTrainingModel.id;

        const response = await TrainingModuleApi.createTrainingModule(
          updateTrainingModel
        );
      } else {
        const response = await TrainingModuleApi.updateTrainingModule(
          updateTrainingModel.id,
          updateTrainingModel
        );
      }
      Swal.fire("Success", `Training module edited successfully!`, "success");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }

    // Disable input fields and Save button after saving
    row.find("input, select").prop("disabled", true);
    row.find(".save-btn").prop("disabled", true);
  });
  // Add new field when the Add button is clicked
  $("#btnAdd").click(function (e) {
    e.preventDefault();
    addField();
  });

  $("#btnSearch").click(function (e) {
    e.preventDefault();
    loadTrainingModule();
  });
});
