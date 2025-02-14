import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as UserApi from "./services/userServices.js";
import * as UserTaskView from "./services/userTaskViewServices.js";
import * as EquipmentApi from "./services/equipmentServices.js";
import * as EqptOccupiedHisApi from "./services/eqptOccupiedHisServices.js";
import * as EquipmentViewApi from "./services/equipmentViewServices.js";
import { isEqualIgnoreCase } from "./utils/stringUtils.js";

async function populateDropdown(dropdownId, taskName) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];
    const options = items
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

populateDropdown("#edit-type", "equipment_type");

async function populateUserDropdown(option) {
  const $userDropdown = $(`#${option}`);
  $userDropdown.empty(); // Clear existing options

  // Add the default "Select" option
  $userDropdown.append(
    `<option value="" disabled selected>Select a User</option>`
  );

  // Filter only the "Equipment" object types and populate dropdown
  const users = await UserApi.getTasks();
  users
    .filter((u) => u.is_active)
    .forEach((u) => {
      $userDropdown.append(
        `<option value="${u.user_id}">${u.username}</option>`
      );
    });
}

async function populateUserTaskDropdown() {
  const user = $("#assign-name").val();
  const eqptType = $("#assign-eqpt-typeid").val();
  const $taskDropdown = $("#assign-task");

  // Clear existing options
  $taskDropdown.empty();

  // Add the default "Select" option
  $taskDropdown.append(
    `<option value="" disabled selected>Select a Task</option>`
  );

  try {
    const userTasks = (await UserTaskView.getUserTaskByUserId(user)) || [];

    userTasks.forEach((task) => {
      if (
        Number(task.equipment_type_id) === Number(eqptType) &&
        Number(task.ct_status) === 1
      ) {
        $taskDropdown.append(
          `<option value="${task.line_id}">${task.ct_name}</option>`
        );
      }
    });

    // Optional: Handle case when no matching tasks are found
    if ($taskDropdown.children().length === 1) {
      $taskDropdown.append(
        `<option value="" disabled>No tasks available</option>`
      );
    }
  } catch (error) {
    console.error("Error populating task dropdown:", error);
  }
}

async function loadEqpt() {
  try {
    const equipments = await EquipmentViewApi.getEqpts();
    if (equipments.length === 0) {
      console.error("Invalid data format:", equipments);
      return;
    }

    console.log(equipments);

    const rows = equipments
      .map(
        (item) => `
      <tr class="eqpt-row" data-eqpt-id="${item.equipment_id}">
        <td>${item.equipment_id}</td>
        <td>${item.equipment_name}</td>
        <td>${item.equipment_code}</td>
        <td>${item.equipment_type}</td>
        <td>${item.occupied_by_name || "N/A"}</td>
        <td>${item.occupied ? "Yes" : "No"}</td>
        <td>
          <button class="btn btn-info btn-sm edit-btn" data-mode="edit" data-id="${
            item.equipment_id
          }">
            Edit
          </button>
          ${
            item.occupied == "0"
              ? `<button class="btn btn-sm btn-danger assign-btn" data-id="${item.equipment_id}">Assign</button>`
              : `<button class="btn btn-sm btn-warning return-btn" data-id="${item.equipment_id}">Return</button>`
          }
        </td>
      </tr>
    `
      )
      .join("");

    $("#equipment-table-body").html(rows);
  } catch (error) {
    console.error("Error loading equipment:", error);
  }
}
async function loadEqptOccupiedHis(eqptId) {
  let tbody = $("#eqpt-occupied-table-body");
  tbody.empty();

  try {
    // Fetch data from API
    const data = await EquipmentViewApi.getEqptOccupiedByEqptId(eqptId);
    // Iterate through data and append rows to the table
    $.each(data, function (index, item) {
      let row = `
        <tr>
          <td>${item.id}</td>
          <td>${item.occupied_by_name || "N/A"}</td>
          <td>${item.occupied_date || "N/A"}</td>
          <td>${item.released_date || "N/A"}</td>
          <td>${item.occupied_task_name || "N/A"}</td>
          <td>${item.released_task_name || "N/A"}</td>
        </tr>
      `;
      tbody.append(row);
    });

    if (data.length === 0) {
      tbody.append(
        '<tr><td colspan="7" class="text-center">No users found</td></tr>'
      );
    }
  } catch (error) {
    console.error("Error loading occupied history:", error);
    tbody.append(
      '<tr><td colspan="7" class="text-center text-danger">Error loading history</td></tr>'
    );
  }
}

async function displayEditEquipment(eqptId) {
  try {
    const equipment = await EquipmentViewApi.getEqptByEqptId(eqptId);
    console.log(equipment);

    if (!equipment) {
      console.error("No equipment data received.");
      return;
    }

    // Fix property typo
    $("#editModalLabel").html("Edit Equipment");
    $("#saveEqpt").data("mode", "edit"); // Set mode
    $("#saveEqpt").data("id", equipment.equipment_id); // Set mode
    $("#edit-id").val(equipment.equipment_id);
    $("#edit-name").val(equipment.equipment_name); // Fixed typo
    $("#edit-code").val(equipment.equipment_code);
    $("#edit-type").val(equipment.equipment_type_id);

    // Ensure modal is properly triggered
    $("#edit-modal").modal("dispose").modal("show");
  } catch (error) {
    console.error("Error fetching equipment data:", error);
  }
}

async function displayNewEquipment() {
  $("#editModalLabel").html("Add New Equipment");
  $("#saveEqpt").data("mode", "add");
  $("#edit-id").val("");
  $("#edit-name").val("");
  $("#edit-code").val("");
  $("#edit-type").val("");
  $("#edit-modal").modal("show");
}

async function saveEquiptment() {
  try {
    const mode = $("#saveEqpt").data("mode");

    if (isEqualIgnoreCase(mode, "edit")) {
      const eqptId = $("#saveEqpt").data("id");

      const eqpt = await EquipmentApi.getTaskById(eqptId);
      eqpt.equipment_name = $("#edit-name").val();
      eqpt.equipment_code = $("#edit-code").val();
      eqpt.equipment_type_id = $("#edit-type").val();

      await EquipmentApi.updateTask(eqptId, eqpt);
    }
    if (isEqualIgnoreCase(mode, "add")) {
      const newEqpt = {
        equipment_name: $("#edit-name").val(),
        equipment_type_id: $("#edit-type").val(),
        equipment_code: $("#edit-code").val(),
        occupied: 0,
      };

      await EquipmentApi.createTask(newEqpt);
    }

    Swal.fire("Success", `Equipment ${mode}ed successfully!`, "success");

    loadEqpt();
  } catch (error) {
    Swal.fire("Error", `Failed to ${mode}ed equipment!`, "error");
  }
}

async function searchEqpt() {
  const eqptName = $("#search-field").val();
  const equipments = await EquipmentViewApi.getEqptByEqptName(eqptName);

  let tbodyEqpt = $("#equipment-table-body");
  tbodyEqpt.empty();
  let tbodyEqptOccupied = $("#eqpt-occupied-table-body");
  tbodyEqptOccupied.empty();

  const rows = equipments
    .map(
      (item) => `
  <tr class="eqpt-row" data-eqpt-id="${item.equipment_id}">
    <td>${item.equipment_id}</td>
    <td>${item.equipment_name}</td>
    <td>${item.equipment_code}</td>
    <td>${item.equipment_type}</td>
    <td>${item.occupied_by_name || "N/A"}</td>
    <td>${item.equiptment_occupied ? "Yes" : "No"}</td>
    <td>
      <button class="btn btn-info btn-sm edit-btn" data-mode="edit" data-id="${
        item.equipment_id
      }">
        Edit
      </button>
      ${
        item.equipment_occupied === "0"
          ? `<button class="btn btn-sm btn-danger assign-btn" data-id="${item.equipment_id}">Assign</button>`
          : `<button class="btn btn-sm btn-warning return-btn" data-id="${item.equipment_id}">Return</button>`
      }
    </td>
  </tr>
`
    )
    .join("");

  $("#equipment-table-body").html(rows);
}

async function assignEqpt(eqptId) {
  populateUserDropdown("assign-name");

  const eqpt = await EquipmentViewApi.getEqptByEqptId(eqptId);

  $("#assign-eqpt-id").val(eqptId);
  $("#assign-eqpt-typeid").val(eqpt.equipment_type_id);
  $("#assign-eqpt-code").val(eqpt.equipment_code);
  $("#assign-eqpt-name").val(eqpt.equipment_name);
  $("#assign-eqpt-type").val(eqpt.equipment_type);

  $("#assign-modal").modal("show");
}

async function assignEqptConfirm() {
  try {
    const eqptOccupied = {
      equipment_id: $("#assign-eqpt-id").val(),
      occupied_by: $("#assign-name").val(),
      occupied_date: new Date(),
      occupied_task_id: $("#assign-task").val() ?? -1,//no task
    };

    console.log(eqptOccupied);

    await EqptOccupiedHisApi.createTask(eqptOccupied);

    const eqpt = await EquipmentApi.getTaskById(eqptOccupied.equipment_id);
    eqpt.occupied = true;
    await EquipmentApi.updateTask(eqpt.equipment_id, eqpt);

    Swal.fire("Success", `Equipment assigned successfully!`, "success");

    loadEqpt();
    loadEqptOccupiedHis(eqptOccupied.equipment_id);
  } catch (error) {
    Swal.fire("Error", `Failed to assigned equipment!`, "error");
  }
}

async function returnEqpt(eqptId) {
  populateUserDropdown("return-name");
}

$(document).ready(async function () {
  loadEqpt();

  $("#equipment-table-body").on("click", ".eqpt-row", function () {
    const eqptId = $(this).data("eqpt-id");
    loadEqptOccupiedHis(eqptId);
  });

  // Edit modal
  $("#equipment-table-body").on("click", ".edit-btn", function () {
    const eqptId = $(this).data("id");
    displayEditEquipment(eqptId);
  });

  $("#equipment-table-body").on("click", ".assign-btn", function () {
    //assgin function
    const eqptId = $(this).data("id");
    assignEqpt(eqptId);
  });

  $("#assign-name").on("change", function () {
    //populate user task
    populateUserTaskDropdown();
  });

  $("#equipment-table-body").on("click", ".return-btn", function () {
    //return function
    const eqptId = $(this).data("id");
    console.log(eqptId);
  });

  $("#assign-form").on("submit", function (e) {
    e.preventDefault();
    assignEqptConfirm();
    $("#assign-modal").modal("hide");
  });

  $("#edit-form").on("submit", function (e) {
    e.preventDefault();
    saveEquiptment();
    $("#edit-modal").modal("hide");
  });

  // Open Add Modal
  $("#new-equipment-btn").on("click", function () {
    displayNewEquipment();
  });

  $("#search-btn").on("click", function () {
    searchEqpt();
  });
});
