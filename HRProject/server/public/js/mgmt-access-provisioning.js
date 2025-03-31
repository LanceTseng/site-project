import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";
import * as AccessProvisioningApi from "./services/accessProvisioningServices.js";
// Correct potential typo in import name if needed
import * as AccessProvisioningViewApi from "./services/accessViewServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";

// --- DOM Element References ---
const tableBody = $("#accessTableBody");
const tableFooter = $("#tableFooter");
const searchForm = $("#search-form");
const searchAccessNameInput = $("#searchAccessName");
const searchAccessTypeSelect = $("#searchAccessType");
const addAccessBtn = $("#addAccess"); // Button in table card header
const accessModal = $("#accessModal");
const accessForm = $("#accessForm");
const modalTitle = $("#accessModalLabel"); // Corrected Modal Title ID
const accessIdInput = $("#accessId");
const editAccessNameInput = $("#editAccessNameInput");
const editAccessDescription = $("#editAccessDescription");
const editAccessTypeSelect = $("#editAccessType");
const editEnabledSelect = $("#editEnabled");
const saveAccessBtn = $("#saveAccess");

// Batch Action Elements
const selectAllCheckbox = $("#selectAll");
const selectedCountSpan = $("#selectedCount");
const enableSelectedBtn = $("#enableSelected");
const disableSelectedBtn = $("#disableSelected");
// const deleteSelectedBtn = $('#deleteSelected'); // Uncomment if using batch delete

// --- UI Helper Functions ---

// Generic error handler
function handleError(error, context) {
  console.error(`${context}:`, error);
  const message =
    error.response?.data?.message || `An error occurred during ${context}.`;
  Swal.fire("Error", message, "error");
}

// Populate Dropdowns
async function populateDropdown(
  dropdownId,
  taskName,
  defaultOptionText = "-- Select --"
) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];
    let options = `<option value="">${defaultOptionText}</option>`; // Use empty value for "All" or "-- Select --"
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

// Reset Checkboxes and Batch Buttons
// Make it globally accessible or call it from within load/search functions
window.resetBatchActions = function () {
  selectAllCheckbox.prop("checked", false);
  // Uncheck all item checkboxes explicitly if needed after reload
  // $('.select-item', tableBody).prop('checked', false);
  updateBatchButtonsState();
};

// Update Selected Count and Button States
function updateBatchButtonsState() {
  const selectedItems = $(".select-item:checked", tableBody);
  const count = selectedItems.length;
  selectedCountSpan.text(count);

  const enabled = count > 0;
  enableSelectedBtn.prop("disabled", !enabled);
  disableSelectedBtn.prop("disabled", !enabled);
  // deleteSelectedBtn.prop('disabled', !enabled); // If using
}

// --- Data Loading and Rendering ---

// Render Table Rows
function renderAccessList(accessItems) {
  tableBody.empty(); // Clear existing rows

  if (!accessItems || accessItems.length === 0) {
    tableBody.append(
      '<tr><td colspan="7" class="text-center text-muted">No access records found.</td></tr>'
    ); // Updated colspan
    tableFooter.text("No records found.");
    resetBatchActions(); // Reset batch state
    return;
  }

  const rows = accessItems
    .map((item) => {
      const isEnabled = item.enabled === true || item.enabled === 1; // Handle boolean or 1/0
      const badgeClass = isEnabled ? "badge-success" : "badge-danger";
      const badgeText = isEnabled ? "Yes" : "No";

      return `
          <tr data-access-id="${item.access_id}">
            <td class="text-center">
                <input type="checkbox" class="select-item" value="${
                  item.access_id
                }" />
            </td>
            <td>${item.access_name || "N/A"}</td>
            <td>${item.access_description || ""}</td>
            <td>${item.access_type_name || "N/A"}</td>
            <td class="text-center"><span class="badge ${badgeClass}">${badgeText}</span></td>
            <td class="text-center">
              <button class="btn btn-warning btn-sm edit-btn" title="Edit Access"
                      data-toggle="modal" data-target="#accessModal" data-access-id="${
                        item.access_id
                      }">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <!-- Optional Delete Button
              <button class="btn btn-danger btn-sm delete-btn" title="Delete Access" data-access-id="${
                item.access_id
              }">
                <i class="fas fa-trash-alt"></i>
              </button>
              -->
            </td>
          </tr>
        `;
    })
    .join("");

  tableBody.html(rows);
  tableFooter.text(`${accessItems.length} record(s) found.`);
  resetBatchActions(); // Reset batch state after rendering
}

// Load Access Provisioning Data (handles initial load and refresh)
async function loadAccessProvisioning(searchParams = {}) {
  tableBody.html(
    '<tr><td colspan="7" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>'
  ); // Updated colspan
  tableFooter.text("Loading...");
  resetBatchActions();

  try {
    let data;
    // Check if search params are provided
    if (searchParams && (searchParams.name || searchParams.typeId)) {
      data = await AccessProvisioningViewApi.getAccessProvisioningByCondition(
        searchParams.name || "",
        searchParams.typeId || "",
        ""
      );
    } else {
      // Fetch all if no search params
      data = await AccessProvisioningViewApi.getAllAccessProvisioning();
    }
    renderAccessList(data);
  } catch (error) {
    handleError(error, "loading access provisioning data");
    tableBody.html(
      '<tr><td colspan="7" class="text-center text-danger">Error loading data.</td></tr>'
    ); // Updated colspan
    tableFooter.text("Error loading.");
  }
}

// --- Modal and Form Handling ---

// Handle Modal Opening (for Add and Edit)
async function handleModalOpen(event) {
  const button = $(event.relatedTarget); // Button that triggered the modal
  const accessId = button.data("access-id"); // Extract access ID from button
  const modal = $(this); // The modal itself

  accessForm[0].reset(); // Clear previous data
  accessIdInput.val(""); // Clear hidden ID
  saveAccessBtn.prop("disabled", false).html("Save Access"); // Reset button state

  if (accessId) {
    // --- EDIT MODE ---
    modalTitle.text("Edit Access Provision");
    accessIdInput.val(accessId);

    try {
      // Fetch access details via API using accessId
      const data = await AccessProvisioningApi.getTaskById(accessId);
      if (data) {
        editAccessNameInput.val(data.access_name);
        editAccessDescription.val(data.access_description);
        editAccessTypeSelect.val(data.access_type_id); // Assumes ID matches value
        // Convert boolean/number 'enabled' to string 'true'/'false' for the select
        editEnabledSelect.val(
          String(data.enabled === true || data.enabled === 1).toLowerCase()
        );
      } else {
        throw new Error("Access record not found");
      }
    } catch (error) {
      handleError(error, `fetching details for access ID ${accessId}`);
      modal.modal("hide"); // Hide modal if data loading fails
    }
  } else {
    // --- ADD MODE ---
    modalTitle.text("Create Access Provision");
    // Set default values if needed (e.g., default Enabled to 'false' which is No)
    editEnabledSelect.val("false");
  }
}

// Handle Form Submission (Add or Edit)
async function handleFormSubmit(event) {
  event.preventDefault();
  const accessId = accessIdInput.val();
  const isUpdating = !!accessId;
  const modeLabel = isUpdating ? "update" : "create";

  // Gather form data
  const accessData = {
    access_name: editAccessNameInput.val().trim(),
    access_description: editAccessDescription.val().trim(),
    access_type_id: editAccessTypeSelect.val(),
    // Convert string 'true'/'false' from select back to boolean for API
    enabled: editEnabledSelect.val() === "true",
  };

  // Basic Validation
  if (!accessData.access_name || !accessData.access_type_id) {
    Swal.fire(
      "Validation Error",
      "Access Name and Type are required.",
      "warning"
    );
    return;
  }

  // Disable button
  saveAccessBtn
    .prop("disabled", true)
    .html('<i class="fas fa-spinner fa-spin"></i> Saving...');

  try {
    if (isUpdating) {
      await AccessProvisioningApi.updateTask(accessId, accessData);
    } else {
      await AccessProvisioningApi.createTask(accessData);
    }

    Swal.fire(
      "Success",
      `Access provision ${isUpdating ? "updated" : "created"} successfully!`,
      "success"
    );
    accessModal.modal("hide");
    await loadAccessProvisioning(); // Refresh the list
  } catch (error) {
    handleError(error, `${modeLabel} access provision`);
    // Keep modal open on error
  } finally {
    saveAccessBtn.prop("disabled", false).html("Save Access"); // Re-enable button
  }
}

// --- Batch Action Logic ---

// Handle Batch Enable/Disable Button Clicks
async function handleBatchUpdate(enableStatus) {
  const selectedItems = $(".select-item:checked", tableBody);
  const ids = selectedItems
    .map(function () {
      return $(this).val();
    })
    .get(); // Use value attribute

  if (ids.length === 0) {
    Swal.fire("No Selection", "Please select at least one record.", "info");
    return;
  }

  const actionText = enableStatus ? "enable" : "disable";
  const result = await Swal.fire({
    title: `Confirm Batch ${
      actionText.charAt(0).toUpperCase() + actionText.slice(1)
    }`,
    text: `Are you sure you want to ${actionText} ${ids.length} selected record(s)?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: enableStatus ? "#28a745" : "#ffc107", // Success or Warning color
    cancelButtonColor: "#6c757d",
    confirmButtonText: `Yes, ${actionText} them!`,
  });

  if (!result.isConfirmed) return;

  // **Note: This is INEFFICIENT. Ideally use a single batch API endpoint.**
  // Showing loading state can be complex with multiple awaits.
  Swal.fire({
    title: "Processing...",
    text: "Updating records, please wait.",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let successCount = 0;
  let failCount = 0;

  try {
    // Sequentially update to avoid overwhelming server/API (or use Promise.allSettled for concurrent)
    for (const id of ids) {
      try {
        // Fetch not strictly needed if API only needs ID and new status, but safer to prevent overwriting other fields
        // Alternatively, just send { enabled: enableStatus } if API allows partial update
        const currentData = await AccessProvisioningApi.getTaskById(id); // Less efficient
        if (currentData) {
          currentData.enabled = enableStatus;
          await AccessProvisioningApi.updateTask(id, { enabled: enableStatus }); // More efficient if API supports partial update
          successCount++;
        } else {
          failCount++; // If record couldn't be fetched
        }
      } catch (singleError) {
        console.error(`Failed to update ID ${id}:`, singleError);
        failCount++;
      }
    }

    let finalMessage = `${successCount} record(s) updated successfully.`;
    let finalIcon = "success";
    if (failCount > 0) {
      finalMessage += ` ${failCount} failed.`;
      finalIcon = "warning";
    }
    Swal.fire("Batch Update Complete", finalMessage, finalIcon);
  } catch (error) {
    // Catch errors from the overall process (less likely here if individual errors are caught)
    handleError(error, "batch update process");
  } finally {
    await loadAccessProvisioning(); // Refresh list regardless of partial failures
  }
}

// --- Event Listeners Setup ---
$(document).ready(() => {
  // Populate Dropdowns
  populateDropdown("#searchAccessType", "access_type", "All Types");
  populateDropdown("#editAccessType", "access_type", "Select Type");

  // Initial Load
  loadAccessProvisioning();

  // Search Form Submission
  searchForm.on("submit", (e) => {
    e.preventDefault();
    const searchParams = {
      name: searchAccessNameInput.val().trim(),
      typeId: searchAccessTypeSelect.val() || null,
    };
    loadAccessProvisioning(searchParams);
  });

  // Modal Handling
  accessModal.on("show.bs.modal", handleModalOpen);
  accessForm.on("submit", handleFormSubmit);

  // --- Checkbox and Batch Action Listeners ---
  // Select All functionality
  selectAllCheckbox.on("change", function () {
    $(".select-item", tableBody)
      .prop("checked", this.checked)
      .trigger("change"); // Trigger change for delegation
    // updateBatchButtonsState(); // update called by individual changes
  });

  // Individual checkbox change (using delegation)
  tableBody.on("change", ".select-item", function () {
    if (!this.checked) {
      selectAllCheckbox.prop("checked", false);
    }
    // Check if all item checkboxes are now checked
    else if ($(".select-item:not(:checked)", tableBody).length === 0) {
      selectAllCheckbox.prop("checked", true);
    }
    updateBatchButtonsState(); // Update buttons on any item change
  });

  // Batch Enable Button
  enableSelectedBtn.on("click", function () {
    handleBatchUpdate(true); // Pass true to enable
  });

  // Batch Disable Button
  disableSelectedBtn.on("click", function () {
    handleBatchUpdate(false); // Pass false to disable
  });

  // Add Button (Handled by modal show event via data-toggle/target)

  // Edit Button (Handled by modal show event via data-toggle/target)

  // Delete Button (Optional - requires implementation)
  /*
     tableBody.on('click', '.delete-btn', async function() {
         const id = $(this).data('access-id');
         // ... Add confirmation and API call logic ...
     });
     */
}); // End document ready
