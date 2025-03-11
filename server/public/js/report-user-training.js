import * as UserTrainingApi from "./services/userTrainingServices.js";
import * as TrainingModuleApi from "./services/trainingModuleServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";

import { accessVerify } from "./utils/authVerify.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

let loginUser;

let statusType = [];
let trainingDepartment = [];

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

async function loadUserTraining() {
  try {
    const searchUserName = $("#searchUserName").val();
    const searchTrainingName = $("#searchTrainingName").val();
    const searchDepartment = $("#searchDepartment").val();
    const searchStatus = $("#searchStatus").val();

    const response = await UserTrainingApi.getTrainingModuleViewByCondition({
      training_name: searchTrainingName,
      user_name: searchUserName,
      department: searchDepartment,
      status: searchStatus,
    }); // Ensure it's awaited

    const trainingTableBody = $("#trainingTableBody");
    trainingTableBody.empty();

    if (accessVerify == "Training Verifier") {
    }

    response.forEach((training) => {
      let actionButton = "";

      if (isEqualIgnoreCase(training.training_status, "completed")) {
      } else if (
        isEqualIgnoreCase(training.training_status, "pending") &&
        loginUser.user_id == training.user_id
      ) {
        actionButton += `<button class="btn btn-primary btn-sm btn-start" data-id=${training.id}>Start</button>`;
      } else if (
        isEqualIgnoreCase(training.training_status, "processing") &&
        loginUser.user_id == training.user_id
      ) {
        actionButton += `<button class="btn btn-warning btn-sm btn-verify" data-id=${training.id}>Verify</button>`;
      } else if (
        isEqualIgnoreCase(training.training_status, "verifying") &&
        isEqualIgnoreCase(
          loginUser.department_name,
          training.training_department
        )
      ) {
        actionButton += `<button class="btn btn-success btn-sm btn-complete" data-id=${training.id}>Completed</button>`;
      }

      const row = `
            <tr>
              <td>${training.user_name}</td>
              <td>${training.training_module_name}</td>
              <td>${training.training_status}</td>
               <td>${training.training_department}</td>
              <td>${training.verified_name ?? ""}</td>
              <td>${formatDate(training.start_date)}</td>
              <td>${formatDate(training.end_date)}</td>
              <td>
                      ${actionButton}
              </td>
            </tr>
          `;
      trainingTableBody.append(row);
    });
  } catch (error) {
    console.error("Error loading user training:", error);
  }
}

async function updateTrainingStatus(trainingId, updateStatusName) {
  try {
    const uesrTraining = await UserTrainingApi.findUserTrainingById(trainingId);

    const trainingModule = await TrainingModuleApi.getTrainingModuleById(
      uesrTraining.training_module_id
    );

    if (isEqualIgnoreCase(updateStatusName, "processing")) {
      uesrTraining.start_date = new Date();
    }

    if (isEqualIgnoreCase(updateStatusName, "completed")) {
      if (
        uesrTraining.user_id == loginUser.user_id &&
        getDepartmetByName("all").id != trainingModule.training_department_id
      ) {
        Swal.fire("Error", "Can not be completed by yourself.", "error");
        return;
      }
      uesrTraining.end_date = new Date();
      uesrTraining.verified_by = loginUser.user_id;
    }
    //status
    uesrTraining.status = getStatusByName(updateStatusName).id;
    await UserTrainingApi.updateUserTraining(uesrTraining.id, uesrTraining);
    Swal.fire("Success", `Status updated successfully!`, "success");
  } catch (error) {
    console.log(error.message);
    Swal.fire("Error", error.message, "error");
  }
}

async function fetchStatuType() {
  const response = await ObjectTypeApi.getTaskByName("training_status");
  // Extract relevant data
  statusType = response.map((item) => ({
    id: item.object_type_item_key,
    name: item.object_type_item_value,
  }));
}

function getStatusByName(name) {
  const status = statusType.find(
    (item) => item.name.toLowerCase() == name.toLowerCase()
  );
  return status ?? null; // Return the ID or null if not found
}
function getStatusById(id) {
  const status = statusType.find((item) => item.id == id);
  return status ?? null; // Return the ID or null if not found
}

async function fetchTrainingDepartment() {
  const response = await ObjectTypeApi.getTaskByName("training_department");
  // Extract relevant data

  trainingDepartment = response.map((item) => ({
    id: item.object_type_item_key,
    name: item.object_type_item_value,
  }));
}

function getDepartmetById(id) {
  const department = trainingDepartment.find((item) => item.id == id);
  return department ?? null; // Return the ID or null if not found
}

function getDepartmetByName(name) {
  const department = trainingDepartment.find(
    (item) => item.name.toLowerCase() == name.toLowerCase()
  );
  console.log(department);
  return department ?? null; // Return the ID or null if not found
}

$(document).ready(async function () {
  loginUser = JSON.parse(sessionStorage.getItem("user"));

  populateDropdown("#searchDepartment", "training_department");
  populateDropdown("#searchStatus", "training_status");

  await loadUserTraining();
  await fetchStatuType();
  await fetchTrainingDepartment();

  $("#processQuery").click(function (e) {
    e.preventDefault();
    loadUserTraining();
  });

  $("#trainingTableBody").on("click", ".btn-start", (event) => {
    const id = $(event.currentTarget).data("id");
    updateTrainingStatus(id, "processing");
  });
  $("#trainingTableBody").on("click", ".btn-verify", (event) => {
    const id = $(event.currentTarget).data("id");
    updateTrainingStatus(id, "verifying");
  });
  $("#trainingTableBody").on("click", ".btn-complete", (event) => {
    const id = $(event.currentTarget).data("id");
    updateTrainingStatus(id, "completed");
  });
});
