import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as AccessProvisioningApi from "./services/accessProvisioningServices.js";
import * as UserAccessApi from "./services/relUserAccessServices.js";
import * as AccessProvisioninViewgApi from "./services/accessViewServices.js";

import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

async function loadUsers() {
  let tbody = $("#userTableBody");
  tbody.empty();

  const users = await UserEmployeeViewApi.getAllUserEmployees();

  $.each(users, function (index, user) {
    let row = `
            <tr class="user-row" data-userid="${user.user_id}" data-roleid="${user.role_id}">
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td data-id="${user.role_id}">${user.user_role}</td>
               
            </tr>
        `;
    tbody.append(row);
  });
}

async function loadAccessAndUserAccess(user_id, role_id) {
  let tbody = $("#accessTableBody");
  tbody.empty();

  try {
    const access = await AccessProvisioninViewgApi.getAllAccessProvisioning();
    let userAccess = await AccessProvisioninViewgApi.getUserAccessByUserId(
      user_id
    );

    // Ensure userAccess is always an array
    if (!Array.isArray(userAccess)) {
      console.warn("userAccess is not an array, defaulting to an empty array.");
      userAccess = [];
    }

    // Filter access by role_id
    const filteredAccess = access.filter(
      (accessItem) => accessItem.user_role_id == role_id
    );

    $.each(filteredAccess, function (index, access) {
      // Find matching user access records
      let userAccessfilter = userAccess.filter(
        (e) => e.access_id == access.access_id && e.enabled == 1
      );

      // Set enabled status
      let enabled = userAccessfilter.length > 0 ? "Yes" : "No";

      let row = `
              <tr class="access-row" data-accessid="${access.access_id}" data-userid="${user_id}">
                  <td><input type="checkbox" class="select-item" data-accessid="${access.access_id}" data-userid="${user_id}" data-roleid="${access.user_role_id}"/></td>
                  <td>${access.access_id}</td>
                  <td>${access.access_name}</td>
                  <td>${access.access_type_name}</td>
                  <td>${enabled}</td>
              </tr>
          `;
      tbody.append(row);
    });
  } catch (error) {
    console.error("Error loading access and user access:", error);
  }
}
async function updateBatchAccess(status) {
  try {
    const selectedItems = $(".select-item:checked");
    if (selectedItems.length === 0) {
      Swal.fire("Warning", "No records selected!", "warning");
      return;
    }

    let user_id = "";
    let role_id = "";

    const ids = selectedItems
      .map(function () {
        user_id = $(this).data("userid");
        role_id = $(this).data("roleid");
        return $(this).data("accessid");
      })
      .get();

    const result = await Swal.fire({
      title: "Batch Edit Access?",
      text: `Are you sure you want to update [${ids.length}] access records?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    for (let access_id of ids) {
      try {
        const accessExisted = await UserAccessApi.getTaskById(
          user_id,
          access_id
        );
        accessExisted.enabled = status;
        
        await UserAccessApi.updateTask(accessExisted.user_id,accessExisted.access_id , accessExisted);
      } catch (error) {
        await UserAccessApi.createTask({
          user_id: user_id,
          access_id: access_id,
          enabled: status,
        });
        // console.error(`Error updating access ${access_id}:`, error);
      }
    }

    Swal.fire("Success!", "All access records have been updated.", "success");
    loadAccessAndUserAccess(user_id, role_id);
  } catch (error) {
    console.error("Error updating batch status:", error);
    Swal.fire("Error", "Failed to update records!", "error");
  }
}
$(document).ready(function () {
  loadUsers();

  $("#selectAll").on("change", function () {
    $(".select-item").prop("checked", $(this).prop("checked"));
  });

  $(document).on("click", ".user-row", function (e) {
    e.preventDefault();
    let userId = $(this).data("userid");
    let roleId = $(this).data("roleid");

    loadAccessAndUserAccess(userId, roleId);
  });

  $("#addAccess").on("click", function (e) {
    e.preventDefault();
    updateBatchAccess(true);
  });
  $("#removeAccess").on("click", function (e) {
    e.preventDefault();
    updateBatchAccess(false);
  });
});
