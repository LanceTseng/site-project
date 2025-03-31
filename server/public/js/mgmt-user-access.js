import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as AccessProvisioningApi from "./services/accessProvisioningServices.js";
import * as UserAccessApi from "./services/relUserAccessServices.js";
import * as AccessProvisioningViewApi from "./services/accessViewServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

// --- DOM Element References ---
const userTableBody = $("#userTableBody");
const userListFooter = $("#userListFooter");
const searchUserInput = $("#searchUser");
const searchUserBtn = $("#searchUserBtn");

const assignedUserNameSpan = $("#assignedUserName");
const assignedAccessTableBody = $("#assignedAccessTableBody");
const assignedCountSpan = $("#assignedCount");
const assignedSelectedCountSpan = $("#assignedSelectedCount");
const selectAllAssignedCheckbox = $("#selectAllAssigned");
const removeSelectedAccessBtn = $("#removeSelectedAccessBtn");

const availableForUserNameSpan = $("#availableForUserName");
const availableAccessTableBody = $("#availableAccessTableBody");
const availableCountSpan = $("#availableCount");
const availableSelectedCountSpan = $("#availableSelectedCount");
const selectAllAvailableCheckbox = $("#selectAllAvailable");
const addSelectedAccessBtn = $("#addSelectedAccessBtn");

const availableAccessFilterForm = $("#availableAccessFilterForm");
const filterAccessNameInput = $("#filterAccessName");
const filterAccessTypeSelect = $("#filterAccessType");

// --- State Variables ---
let currentSelectedUserId = null;
let currentSelectedUserName = null;
let allAccessDefinitions = [];
let accessDefinitionsLoaded = false;

// --- UI Helper Functions ---
function handleError(error, context) {
  console.error(`${context}:`, error);
  const apiErrorMessage =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message;
  const message = apiErrorMessage || `An error occurred during ${context}.`;
  Swal.fire("Error", message, "error");
}

async function populateDropdown(
  dropdownId,
  taskName,
  defaultOptionText = "All Types"
) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];
    let options = `<option value="">${defaultOptionText}</option>`;
    options += items
      .map(
        (item) =>
          `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
      )
      .join("");
    $(dropdownId).html(options);
  } catch (error) {
    handleError(error, `populating ${taskName} dropdown`);
    $(dropdownId).html(`<option value="">Error loading</option>`);
  }
}

// --- Checkbox & Button State Management ---
function updateRemoveButtonState() {
  const count = $(".select-checkbox:checked", assignedAccessTableBody).length;
  assignedSelectedCountSpan.text(count);
  removeSelectedAccessBtn.prop("disabled", count === 0);
}

window.resetAssignedCheckboxes = function () {
  selectAllAssignedCheckbox.prop("checked", false);
  $(".select-checkbox", assignedAccessTableBody).prop("checked", false);
  updateRemoveButtonState();
};

function updateAddButtonState() {
  const count = $(".select-checkbox:checked", availableAccessTableBody).length;
  availableSelectedCountSpan.text(count);
  addSelectedAccessBtn.prop("disabled", count === 0);
}

window.resetAvailableCheckboxes = function () {
  selectAllAvailableCheckbox.prop("checked", false);
  $(".select-checkbox", availableAccessTableBody).prop("checked", false);
  updateAddButtonState();
};

// --- Data Loading and Rendering ---
async function loadUsers(searchTerm = "") {
  userTableBody
    .empty()
    .html(
      '<tr><td colspan="3" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>'
    );
  userListFooter.text("Loading...");

  try {
    const users = await UserEmployeeViewApi.getAllUserEmployees();
    userTableBody.empty();

    if (!users || users.length === 0) {
      userTableBody.append(
        '<tr><td colspan="3" class="text-center text-muted">No users found.</td></tr>'
      );
      userListFooter.text("No users found.");
      return;
    }

    let userCount = 0;
    $.each(users, function (index, user) {
      const userNameLower = (user.username || "").toLowerCase();
      const userRoleLower = (user.user_role || "").toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();

      if (
        searchTerm &&
        !userNameLower.includes(searchTermLower) &&
        !userRoleLower.includes(searchTermLower)
      ) {
        return;
      }

      const safeUserName = (user.username || "").replace(/"/g, "&quot;");
      const row = `
        <tr data-user-id="${user.user_id}" data-user-name="${safeUserName}" >
          <td>${user.user_id}</td>
          <td>${user.username || ""}</td>
          <td>${user.user_role || "N/A"}</td>
        </tr>
      `;
      userTableBody.append(row);
      userCount++;
    });

    if (userCount === 0 && searchTerm) {
      userTableBody.append(
        `<tr><td colspan="3" class="text-center text-muted">No users found matching "${searchTerm}".</td></tr>`
      );
    }
    userListFooter.text(`${userCount} user(s) found.`);
  } catch (error) {
    handleError(error, "loading users");
    userTableBody
      .empty()
      .html(
        '<tr><td colspan="3" class="text-center text-danger">Error loading users.</td></tr>'
      );
    userListFooter.text("Error loading.");
  }
}

async function loadAllAccessDefinitions() {
  try {
    allAccessDefinitions =
      (await AccessProvisioningViewApi.getAllAccessProvisioning()).filter(
        (X) => X.enabled == 1
      ) || [];
    accessDefinitionsLoaded = allAccessDefinitions.length > 0;
    if (!accessDefinitionsLoaded) {
      console.warn("No access definitions were loaded.");
    }
  } catch (error) {
    accessDefinitionsLoaded = false;
    handleError(error, "loading all access definitions");
    Swal.fire(
      "Critical Error",
      "Could not load access definitions necessary for management. Please refresh or contact support.",
      "error"
    );
    allAccessDefinitions = [];
  }
}

async function loadAssignedAccess(userId) {
  assignedAccessTableBody
    .empty()
    .html(
      '<tr><td colspan="3" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading assigned...</td></tr>'
    );
  assignedCountSpan.text("...");
  resetAssignedCheckboxes();

  if (!userId) {
    assignedAccessTableBody
      .empty()
      .html(
        '<tr><td colspan="3" class="text-center text-muted">Select a user first.</td></tr>'
      );
    assignedCountSpan.text("0");
    return;
  }

  try {
    const assigned =
      (await AccessProvisioningViewApi.getUserAccessByUserId(userId))?.filter(
        (x) => x.enabled == 1
      ) || [];
    assignedAccessTableBody.empty();

    if (assigned.length === 0) {
      assignedAccessTableBody.append(
        '<tr><td colspan="3" class="text-center text-muted">No access assigned to this user.</td></tr>'
      );
      assignedCountSpan.text("0");
      return;
    }

    const rows = assigned
      .map(
        (item) => `
        <tr>
          <td class="checkbox-col">
            <input type="checkbox" class="select-checkbox" value="${
              item.access_id
            }" />
          </td>
          <td>${item.access_name || "N/A"}</td>
          <td>${item.access_type_name || "N/A"}</td>
        </tr>
      `
      )
      .join("");

    assignedAccessTableBody.html(rows);
    assignedCountSpan.text(assigned.length);
  } catch (error) {
    handleError(error, `loading assigned access for user ${userId}`);
    assignedAccessTableBody
      .empty()
      .html(
        '<tr><td colspan="3" class="text-center text-danger">Error loading assigned access.</td></tr>'
      );
    assignedCountSpan.text("Error");
  } finally {
    resetAssignedCheckboxes();
  }
}

async function loadAvailableAccess(userId, filters = {}) {
  availableAccessTableBody
    .empty()
    .html(
      '<tr><td colspan="4" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading available...</td></tr>'
    );
  availableCountSpan.text("...");
  resetAvailableCheckboxes();

  if (!userId) {
    availableAccessTableBody
      .empty()
      .html(
        '<tr><td colspan="4" class="text-center text-muted">Select a user first.</td></tr>'
      );
    availableCountSpan.text("0");
    return;
  }
  if (!accessDefinitionsLoaded) {
    availableAccessTableBody
      .empty()
      .html(
        '<tr><td colspan="4" class="text-center text-warning">Access definitions not loaded. Cannot show available access.</td></tr>'
      );
    availableCountSpan.text("N/A");
    return;
  }

  try {
    const assigned =
      (await AccessProvisioningViewApi.getUserAccessByUserId(userId)) || [];
    const assignedIds = new Set(assigned.map((item) => item.access_id));

    const available = allAccessDefinitions.filter((def) => {
      if (!def || typeof def.access_id === "undefined") return false;
      if (assignedIds.has(def.access_id)) return false;

      const nameFilter = (filters.name || "").toLowerCase();
      const typeFilter = filters.typeId || "";

      if (
        nameFilter &&
        !(def.access_name || "").toLowerCase().includes(nameFilter)
      )
        return false;
      if (typeFilter && String(def.access_type_id) !== String(typeFilter))
        return false;

      return true;
    });

    availableAccessTableBody.empty();

    if (available.length === 0) {
      availableAccessTableBody.append(
        '<tr><td colspan="4" class="text-center text-muted">No matching available access found.</td></tr>'
      );
      availableCountSpan.text("0");
      return;
    }

    const rows = available
      .map(
        (def) => `
        <tr>
          <td class="checkbox-col">
            <input type="checkbox" class="select-checkbox" value="${
              def.access_id
            }" />
          </td>
          <td>${def.access_name || "N/A"}</td>
          <td>${def.access_type_name || "N/A"}</td>
          <td class="text-center">
            <i class="fas ${
              def.enabled ? "fa-check text-success" : "fa-times text-danger"
            }"></i>
          </td>
        </tr>
      `
      )
      .join("");

    availableAccessTableBody.html(rows);
    availableCountSpan.text(available.length);
  } catch (error) {
    handleError(error, `loading available access for user ${userId}`);
    availableAccessTableBody
      .empty()
      .html(
        '<tr><td colspan="4" class="text-center text-danger">Error loading available access.</td></tr>'
      );
    availableCountSpan.text("Error");
  } finally {
    resetAvailableCheckboxes();
  }
}

// --- Action Handlers ---
async function handleAddSelectedAccess() {
  if (!currentSelectedUserId) {
    Swal.fire("No User Selected", "Please select a user first.", "warning");
    return;
  }

  const selectedItems = $(".select-checkbox:checked", availableAccessTableBody);
  const accessIdsToAdd = selectedItems
    .map(function () {
      return $(this).val();
    })
    .get();

  if (accessIdsToAdd.length === 0) {
    Swal.fire(
      "No Selection",
      "Please select access from the 'Available' list to add.",
      "info"
    );
    return;
  }

  const result = await Swal.fire({
    title: `Add ${accessIdsToAdd.length} Access Item(s)?`,
    text: `Assign the selected access items to ${currentSelectedUserName}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#28a745",
    confirmButtonText: "Yes, Add Access",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Processing...",
    text: "Assigning access...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let successCount = 0;
  let failCount = 0;

  for (const accessId of accessIdsToAdd) {
    try {
      let existing = null;
      try {
        existing = await UserAccessApi.getTaskById(
          currentSelectedUserId,
          accessId
        );
      } catch (getError) {
        if (!getError.response || getError.response.status !== 404) {
          console.warn(
            `Checking existence for access ${accessId} failed:`,
            getError.message
          );
        }
      }

      if (existing) {
        if (existing.enabled !== true) {
          existing.enabled = true;
          await UserAccessApi.updateTask(
            currentSelectedUserId,
            accessId,
            existing
          );
        }
        successCount++;
      } else {
        await UserAccessApi.createTask({
          user_id: currentSelectedUserId,
          access_id: accessId,
          enabled: true,
        });
        successCount++;
      }
    } catch (operationError) {
      console.error(`Failed operation for access ${accessId}:`, operationError);
      failCount++;
    }
  }

  let finalMessage = `${successCount} access item(s) processed successfully.`;
  let finalIcon = "success";
  if (failCount > 0) {
    finalMessage += ` ${failCount} failed.`;
    finalIcon = "warning";
  }
  Swal.fire("Assignment Complete", finalMessage, finalIcon);

  await loadAssignedAccess(currentSelectedUserId);
  await loadAvailableAccess(currentSelectedUserId, {
    name: filterAccessNameInput.val().trim(),
    typeId: filterAccessTypeSelect.val(),
  });
}

async function handleRemoveSelectedAccess() {
  if (!currentSelectedUserId) {
    Swal.fire("No User Selected", "Please select a user first.", "warning");
    return;
  }

  const selectedItems = $(".select-checkbox:checked", assignedAccessTableBody);
  const accessIdsToRemove = selectedItems
    .map(function () {
      return $(this).val();
    })
    .get();

  if (accessIdsToRemove.length === 0) {
    Swal.fire(
      "No Selection",
      "Please select access from the 'Assigned' list to remove.",
      "info"
    );
    return;
  }

  const result = await Swal.fire({
    title: `Remove ${accessIdsToRemove.length} Access Item(s)?`,
    text: `Remove the selected access items from ${currentSelectedUserName}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Yes, Remove Access",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Processing...",
    text: "Removing access...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let successCount = 0;
  let failCount = 0;

  for (const accessId of accessIdsToRemove) {
    try {
      await UserAccessApi.updateTask(currentSelectedUserId, accessId, {
        enabled: false,
      });
      successCount++;
    } catch (error) {
      console.error(`Failed to remove access ${accessId}:`, error);
      failCount++;
    }
  }

  let finalMessage = `${successCount} access item(s) removed successfully.`;
  let finalIcon = "success";
  if (failCount > 0) {
    finalMessage += ` ${failCount} failed.`;
    finalIcon = "warning";
  }
  Swal.fire("Removal Complete", finalMessage, finalIcon);

  await loadAssignedAccess(currentSelectedUserId);
  await loadAvailableAccess(currentSelectedUserId, {
    name: filterAccessNameInput.val().trim(),
    typeId: filterAccessTypeSelect.val(),
  });
}

// --- Event Listeners Setup ---
$(document).ready(async () => {
  await populateDropdown("#filterAccessType", "access_type", "All Types");
  await loadAllAccessDefinitions();
  await loadUsers();

  // User Search
  searchUserBtn.on("click", () => loadUsers(searchUserInput.val().trim()));
  searchUserInput.on("keypress", (e) => {
    if (e.which === 13) loadUsers(searchUserInput.val().trim());
  });

  // User Row Click (Select User)
  userTableBody.on("click", "tr", async function () {
    const userId = $(this).data("user-id"); // Fixed data attribute name
    const userName = $(this).data("user-name");

    if (!userId || $(this).hasClass("table-active")) return;

    currentSelectedUserId = userId;
    currentSelectedUserName = userName;
    userTableBody.find("tr").removeClass("table-active");
    $(this).addClass("table-active");

    assignedUserNameSpan.text(userName);
    availableForUserNameSpan.text(userName);

    Swal.fire({
      title: "Loading Access...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await loadAssignedAccess(userId);
      await loadAvailableAccess(userId, {
        name: filterAccessNameInput.val().trim(),
        typeId: filterAccessTypeSelect.val(),
      });
      Swal.close();
    } catch (error) {
      console.error("Error during user selection:", error);
      Swal.close();
    }
  });

  // Available Access Filter Form
  availableAccessFilterForm.on("submit", async (e) => {
    e.preventDefault();
    if (!currentSelectedUserId) {
      Swal.fire("No User Selected", "Please select a user first.", "warning");
      return;
    }
    await loadAvailableAccess(currentSelectedUserId, {
      name: filterAccessNameInput.val().trim(),
      typeId: filterAccessTypeSelect.val(),
    });
  });

  // Checkbox logic
  selectAllAssignedCheckbox.on("change", function () {
    $(".select-checkbox", assignedAccessTableBody)
      .prop("checked", this.checked)
      .trigger("change");
    updateRemoveButtonState();
  });
  assignedAccessTableBody.on("change", ".select-checkbox", function () {
    if (!this.checked) {
      selectAllAssignedCheckbox.prop("checked", false);
    } else if (
      $(".select-checkbox:not(:checked)", assignedAccessTableBody).length === 0
    ) {
      selectAllAssignedCheckbox.prop("checked", true);
    }
    updateRemoveButtonState();
  });

  selectAllAvailableCheckbox.on("change", function () {
    $(".select-checkbox", availableAccessTableBody)
      .prop("checked", this.checked)
      .trigger("change");
    updateAddButtonState();
  });
  availableAccessTableBody.on("change", ".select-checkbox", function () {
    if (!this.checked) {
      selectAllAvailableCheckbox.prop("checked", false);
    } else if (
      $(".select-checkbox:not(:checked)", availableAccessTableBody).length === 0
    ) {
      selectAllAvailableCheckbox.prop("checked", true);
    }
    updateAddButtonState();
  });

  // Action Buttons
  addSelectedAccessBtn.on("click", handleAddSelectedAccess);
  removeSelectedAccessBtn.on("click", handleRemoveSelectedAccess);

  // Initial states
  updateRemoveButtonState();
  updateAddButtonState();
  assignedAccessTableBody.html(
    '<tr><td colspan="3" class="text-center text-muted">Select a user to view assigned access.</td></tr>'
  );
  availableAccessTableBody.html(
    '<tr><td colspan="4" class="text-center text-muted">Select a user to view available access.</td></tr>'
  );
  assignedCountSpan.text("0");
  availableCountSpan.text("0");
  assignedSelectedCountSpan.text("0");
  availableSelectedCountSpan.text("0");
});
