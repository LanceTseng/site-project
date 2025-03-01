import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";
import * as AccessProvisioningApi from "./services/accessProvisioningServices.js";
import * as AccessProvisioninViewgApi from "./services/accessViewServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";

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

// Function to load access provisioning data
async function loadAccessProvisioning() {
  try {
    const response = await AccessProvisioninViewgApi.getAllAccessProvisioning();

    let tableBody = response
      .map(
        (item) => `
        <tr>
          <td><input type="checkbox" class="select-item" data-id="${
            item.access_id
          }" /></td>
          <td>${item.access_name}</td>
          <td>${item.access_description}</td>
          <td>${item.access_type_name}</td>
          <td>${item.access_role_name}</td>
          <td>${item.enabled ? "Yes" : "No"}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${
              item.access_id
            }">
              <i class="fas fa-edit"></i> Edit
            </button>
          </td>
        </tr>
      `
      )
      .join("");

    $("#accessTableBody").html(tableBody);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function EditModal(id) {
  const response = await AccessProvisioningApi.getTaskById(id);

  $("#accessId").val(response.access_id);
  $("#editAccessNameInput").val(response.access_name);
  $("#editAccessDescription").val(response.access_description);
  $("#editAccessType").val(response.access_type_id);
  $("#editRole").val(response.access_role_id);
  $("#editEnabled").val(response.enabled);
  $("#modalTitle").text("Edit Access");
  $("#accessModal").modal("show");
  $("#saveAccess").data("mode", "edit"); // Set mode
}

function AddModal() {
  $("#accessId").val("");
  $("#editAccessNameInput").val("");
  $("#editAccessDescription").val("");
  $("#editAccessType").val("");
  $("#editRole").val("");
  $("#editEnabled").val("");
  $("#modalTitle").text("Create Access");
  $("#accessModal").modal("show");
  $("#saveAccess").data("mode", "add"); // Set mode
}

// Function to search access provisioning
async function searchAccess() {
  try {
    const accessName = $("#searchAccessName").val().trim();
    const accessType = $("#searchAccessType").val(); // Convert empty to null
    const roleName = $("#searchRole").val(); // Convert empty to null

    const response =
      await AccessProvisioninViewgApi.getAccessProvisioningByCondition(
        accessName,
        accessType,
        roleName
      );

    console.log(response);

    if (!response || response.length === 0) {
      $("#accessTableBody").html(
        `<tr><td colspan="7" class="text-center">No records found.</td></tr>`
      );
      return;
    }

    let tableBody = "";
    response.forEach((item) => {
      tableBody += `
        <tr>
          <td><input type="checkbox" class="select-item" data-id="${
            item.access_id
          }" /></td>
          <td>${item.access_name}</td>
          <td>${item.access_description || "N/A"}</td>
          <td>${item.access_type_name || "N/A"}</td>
          <td>${item.access_role_name || "N/A"}</td>
          <td>${item.enabled ? "Yes" : "No"}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${
              item.access_id
            }">
              <i class="fas fa-edit"></i> Edit
            </button>
          </td>
        </tr>`;
    });

    $("#accessTableBody").html(tableBody);
  } catch (error) {
    console.error("Error searching access provisioning:", error);
    Swal.fire("Error", "Failed to retrieve data. Please try again.", "error");
  }
}

async function SaveAccess() {
  try {
    const mode = $("#saveAccess").data("mode");
    const accessId = $("#accessId").val();
    const accessName = $("#editAccessNameInput").val();
    const accessDescription = $("#editAccessDescription").val();
    const accessType = $("#editAccessType").val();
    const accessRole = $("#editRole").val();
    const enabled = $("#editEnabled").val();

    if (mode === "add") {
      await AccessProvisioningApi.createTask({
        access_name: accessName,
        access_description: accessDescription,
        access_type_id: accessType,
        access_role_id: accessRole,
        enabled: enabled,
      });
    } else {
      await AccessProvisioningApi.updateTask(accessId, {
        access_name: accessName,
        access_description: accessDescription,
        access_type_id: accessType,
        access_role_id: accessRole,
        enabled: enabled,
      });
    }

    $("#accessModal").modal("hide");
    loadAccessProvisioning();

    Swal.fire(
      "Success",
      `Access provisioning ${mode}ed successfully!`,
      "success"
    );
  } catch (error) {
    console.error("Error saving access provisioning:", error);
    Swal.fire("Error", `Please fill in all required fields.`, "error");
  }
}

async function updateBatchStatus(status) {
  try {
    const selectedItems = $(".select-item:checked");
    const ids = selectedItems
      .map(function () {
        return $(this).data("id");
      })
      .get();

    if (ids.length === 0) {
      Swal.fire("Warning", "No records selected!", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Batch Edit Accesss?",
      text: `Are you sure you want to edit [${ids.length}] access provisioning?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    await Promise.all(
      ids.map(async (id) => {
        const access = await AccessProvisioningApi.getTaskById(id);
        access.enabled = status;
        console.log(access);
        await AccessProvisioningApi.updateTask(id, access);
      })
    );

    Swal.fire("Started!", "All access has updated.", "success");
    loadAccessProvisioning();
  } catch (error) {
    console.error("Error updating batch status:", error);
    Swal.fire("Error", "Failed to update records!", "error");
  }
}

// Ensure the function runs after DOM is fully loaded
$(document).ready(() => {
  populateDropdown("#searchRole", "user_role");
  populateDropdown("#searchAccessType", "access_type");
  populateDropdown("#editRole", "user_role");
  populateDropdown("#editAccessType", "access_type");
  loadAccessProvisioning();

  $("#selectAll").on("change", function () {
    $(".select-item").prop("checked", $(this).prop("checked"));
  });

  $("#addAccess").on("click", function () {
    AddModal();
  });

  $(document).on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    EditModal(id);
  });

  $("#accessForm").submit(function (e) {
    e.preventDefault();
    SaveAccess();
  });

  $("#enableSelected").on("click", function () {
    updateBatchStatus(true);
  });
  $("#disableSelected").on("click", function () {
    updateBatchStatus(false);
  });

  $("#searchAccess").on("click", function (e) {
    e.preventDefault();
    searchAccess();
  });
});
