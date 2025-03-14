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
    const searchLineId = $("#searchLineId").val();

    const response = await UserTrainingApi.getTrainingModuleViewByCondition({
      training_name: searchTrainingName,
      user_name: searchUserName,
      department: searchDepartment,
      status: searchStatus,
      user_childtask_id: searchLineId,
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
    loadUserTraining();
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
  return department ?? null; // Return the ID or null if not found
}

async function navigateFromUserTask() {
  //navigate from user task
  const pathParts = window.location.pathname.split("/"); // Split by "/"

  // Find dynamic parameters based on your URL structure
  const lineIdIndex = pathParts.indexOf("lineid") + 1; // Get index after 'form'
  const trainingDeptIdIndex = pathParts.indexOf("trainingdeptid") + 1; // Get index after 'lineid'
  const userIdIndex = pathParts.indexOf("userid") + 1;

  // Extract formId and lineId safely
  const lindId = lineIdIndex > 0 ? pathParts[lineIdIndex] : null;
  const trainingDeptId =
    trainingDeptIdIndex > 0 ? pathParts[trainingDeptIdIndex] : null;
  const userId = userIdIndex > 0 ? pathParts[userIdIndex] : null;

  $("#searchDepartment").val(trainingDeptId);
  $("#searchLineId").val(lindId);

  if (lindId != null && trainingDeptId != null && userId == loginUser.user_id) {
    initUserTraining(lindId, trainingDeptId);
  }
}

async function initUserTraining(line_id, trainingDeptId) {
  try {
    // Check if user training already exists
    const userTrainingExist =
      await UserTrainingApi.getTrainingModuleViewByCondition({
        user_childtask_id: line_id,
      });

    if (userTrainingExist.length > 0) return;

    // Fetch training modules by department
    const trainingModules =
      await TrainingModuleApi.getTrainingModuleByDepartmentId(trainingDeptId);
    if (!trainingModules || trainingModules.length === 0) return; // Avoid unnecessary iterations

    // Loop over training modules and create user training
    for (const module of trainingModules) {
      await UserTrainingApi.createUserTraining({
        user_id: loginUser.user_id,
        training_module_id: module.training_module_id,
        status: 1,
        link_user_childtask_id: line_id,
      });
    }
    await loadUserTraining();
  } catch (error) {
    console.error("Error initializing user training:", error);
  }
}

//-----------------------------

$(document).ready(async function () {
  loginUser = JSON.parse(sessionStorage.getItem("user"));

  await navigateFromUserTask();

  populateDropdown("#searchDepartment", "training_department");
  populateDropdown("#searchStatus", "training_status");

  if (!accessVerify("Training Full Access")) {
    $("#searchUserName").val(loginUser.username);
    $("#searchUserName").prop("disabled", true);
  }

  await loadUserTraining();
  await fetchStatuType();
  await fetchTrainingDepartment();

  $("#processQuery").click(function (e) {
    e.preventDefault();
    $("#searchLineId").val("");
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
