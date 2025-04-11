/**
 * @file report-ticket.js
 * @description Manages ticket creation, search, display, and updates.
 */

import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as TicketApi from "./services/ticketServices.js";
import * as EmployeeApi from "./services/employeeServices.js";
import { accessVerify } from "./utils/authVerify.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

// --- Constants ---
const TICKET_STATUS = {
  NEW: "new",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REJECT: "reject",
};

// --- DOM Element Caching ---
const domElements = {
  // Search Form
  searchForm: "#search-form",
  searchTicket: "#searchTicket",
  searchDepartment: "#searchDepartment",
  searchTicketStatus: "#searchTicketStatus",
  btnSearch: "#btnSearch",

  // Ticket List
  ticketTableBody: "#ticketTableBody",

  // Ticket Details
  ticketTitle: "#ticketTitle",
  ticketDescription: "#ticketDescription",
  ticketId: "#ticketId",
  commentsSection: "#commentsSection",
  responseArea: "#response-area",
  commentInput: "#commentInput",
  postComment: "#postComment",

  // Action Buttons
  btnReOpen: "#btnReOpen",
  btnProcessing: "#btnProcessing",
  btnCompleted: "#btnCompleted",
  btnCancel: "#btnCancel",
  btnReject: "#btnReject",

  // Create Ticket Modal
  ticketModal: "#ticketModal",
  addTicketTitle: "#addTicketTitle",
  addTicketDepartment: "#addTicketDepartment",
  addTicketDescription: "#addTicketDescription",
  submitTicket: "#submitTicket",
};

// --- Global Variables ---
let loginUser = null;
let loggedInEmployee = null;
let departments = [];
let ticketStatuses = [];

// --- Utility Functions ---

/**
 * @function showError
 * @description Displays an error message using SweetAlert2.
 * @param {string} message - The error message to display.
 */
function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
}

/**
 * @function showSuccess
 * @description Displays a success message using SweetAlert2.
 * @param {string} message - The success message to display.
 */
function showSuccess(message) {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
  });
}

/**
 * @function populateDropdown
 * @description Populates a select dropdown with data from an API call.
 * @param {string} dropdownId - The ID of the select element.
 * @param {string} taskName - The task name to retrieve from the ObjectTypeApi.
 */
async function populateDropdown(dropdownId, taskName) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(taskName)) || [];

    // Store the fetched data
    if (taskName === "department") {
      departments = items;
    } else if (taskName === "ticket_status") {
      ticketStatuses = items;
    }

    const options = items
      .map(
        (item) =>
          `<option value="${item.object_type_item_key}">${item.object_type_item_value}</option>`
      )
      .join("");

    $(dropdownId).html(`<option value="">Select an Option</option>${options}`);
  } catch (error) {
    console.error(`Error populating ${taskName} dropdown:`, error);
    showError(`Failed to load ${taskName} options.`);
  }
}

/**
 * @function init
 * @description Initializes the ticket details section by hiding action buttons and the response area.
 */
function init() {
  $(domElements.btnProcessing).hide();
  $(domElements.btnCompleted).hide();
  $(domElements.btnCancel).hide();
  $(domElements.btnReject).hide();
  $(domElements.btnReOpen).hide();
  $(domElements.responseArea).hide();
}

/**
 * @function getStatusBadgeClass
 * @description Returns the appropriate Bootstrap badge class based on the ticket status.
 * @param {string} status - The ticket status.
 * @returns {string} The Bootstrap badge class.
 */
function getStatusBadgeClass(status) {
  const statusClasses = {
    [TICKET_STATUS.COMPLETED]: "bg-success text-white",
    [TICKET_STATUS.NEW]: "bg-info",
    [TICKET_STATUS.PROCESSING]: "bg-warning",
    [TICKET_STATUS.CANCELLED]: "bg-danger text-white",
    [TICKET_STATUS.REJECT]: "bg-secondary text-white",
  };

  return statusClasses[status] || "bg-secondary";
}

/**
 * @function loadTicketHead
 * @description Loads the list of tickets and displays them in the ticket table.
 */
async function loadTicketHead() {
  try {
    let ticketHead = [];
    const userId = accessVerify("Ticket Full Access")
      ? null
      : loginUser.user_id;

    const loadingRow = `
        <tr>
            <td colspan="6" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p>Loading tickets...</p>
            </td>
        </tr>`;
    $(domElements.ticketTableBody).html(loadingRow);

    if (userId) {
      ticketHead = await TicketApi.getTicketHeadViewByCondition({
        user_id: userId,
      });
    } else {
      ticketHead = await TicketApi.getAllTicketHeadView();
    }

    ticketHead.sort(
      (a, b) =>
        new Date(b.ticket_last_updated_date) -
        new Date(a.ticket_last_updated_date)
    );

    const ticketTableBody = ticketHead
      .map((ticket) => {
        const statusClass = getStatusBadgeClass(
          ticket.ticket_status_name.toLowerCase()
        );

        return `
                    <tr class="ticket-row" data-id="${ticket.ticket_id}">
                        <td>${ticket.ticket_id}</td>
                        <td>${ticket.ticket_topic}</td>
                        <td><span class="badge ${statusClass}">${
          ticket.ticket_status_name
        }</span></td>
                        <td>${ticket.department_name}</td>
                        <td>${ticket.ticket_request_by_name}</td>
                        <td>${formatDate(ticket.ticket_last_updated_date)}</td>
                    </tr>
                `;
      })
      .join("");

    $(domElements.ticketTableBody).html(ticketTableBody);
  } catch (error) {
    console.error("Error loading ticket list:", error);
    showError("Failed to load ticket list.");
    $(domElements.ticketTableBody).html(
      `<tr><td colspan="6" class="text-center">Failed to load tickets. Please try again later.</td></tr>`
    );
  }
}

/**
 * @function loadTicketDetail
 * @description Loads and displays the details of a selected ticket.
 * @param {string} ticketId - The ID of the ticket to load.
 */
async function loadTicketDetail(ticketId) {
  init(); // Hide everything initially

  try {
    const response = await TicketApi.getTicketsByCondition({
      head_id: ticketId,
    });
    if (!response || response.length === 0) {
      showError("Ticket details not found");
      $(domElements.commentsSection).html(""); // Clear comments section
      $(domElements.responseArea).hide();
      return;
    }
    //sort for the most recent
    response.sort(
      (a, b) =>
        new Date(b.ticket_last_updated_date) -
        new Date(a.ticket_last_updated_date)
    );
    const ticketHead = response[0];

    $(domElements.responseArea).show();
    $(domElements.ticketTitle).html(ticketHead.ticket_topic);
    $(domElements.ticketDescription).html(ticketHead.ticket_description);
    $(domElements.ticketId).html(ticketHead.ticket_id);

    // -- Action Buttons Visibility --
    const ticketStatus = ticketHead.ticket_status_name.toLowerCase();
    const isMyDepartment =
      ticketHead.ticket_department_id == loggedInEmployee.department_id;
    const isMyTicket = ticketHead.ticket_request_by_id == loginUser.user_id;

    if (ticketStatus === TICKET_STATUS.NEW) {
      if (isMyDepartment) $(domElements.btnProcessing).show();
      if (isMyTicket) $(domElements.btnCancel).show();
    } else if (ticketStatus === TICKET_STATUS.PROCESSING) {
      if (isMyDepartment) {
        $(domElements.btnReject).show();
        $(domElements.btnCompleted).show();
      }
    } else if (ticketStatus === TICKET_STATUS.REJECT) {
      if (isMyTicket) {
        $(domElements.btnCancel).show();
        $(domElements.btnReOpen).show();
        $(domElements.responseArea).hide(); //Hide the comment if it is reject
      }
    } else if (
      ticketStatus === TICKET_STATUS.COMPLETED ||
      ticketStatus === TICKET_STATUS.CANCELLED
    ) {
      $(domElements.responseArea).hide();
    }

    // -- Render Comments Section --
    const commentsSectionHTML = response
      .map(
        (comment) => `
                <div class="comment card p-2 mb-2">
                    <strong>${comment.response_by_name || "Anonymous"}</strong>
                    <p>${comment.response_text || "No comment"}</p>
                    <p class="text-muted small">${formatDate(
                      comment.response_date
                    )}</p>
                </div>`
      )
      .join("");

    $(domElements.commentsSection).html(commentsSectionHTML);
  } catch (error) {
    console.error("Error loading ticket details:", error);
    showError("Failed to load ticket details.");
    $(domElements.commentsSection).html("<p>Failed to load comments.</p>"); // Show error in comments
  }
}

/**
 * @function createTicket
 * @description Creates a new ticket using the data from the modal form.
 */
async function createTicket() {
  const title = $(domElements.addTicketTitle).val().trim();
  const department = $(domElements.addTicketDepartment).val();
  const description = $(domElements.addTicketDescription).val().trim();

  if (!title || !department || !description) {
    showError("Please fill in all fields!");
    return;
  }

  try {
    await TicketApi.createTicketHead({
      ticket_topic: title,
      description: description,
      ticket_department_id: department,
      status: 1,
      created_by: loginUser.user_id,
    });

    showSuccess("Ticket created successfully!");
    $(domElements.ticketModal).modal("hide");
    $(domElements.addTicketTitle).val("");
    $(domElements.addTicketDepartment).val("");
    $(domElements.addTicketDescription).val("");
    loadTicketHead(); // Reload the ticket list
  } catch (error) {
    console.error("Error creating ticket:", error);
    showError("Failed to create ticket.");
  }
}

/**
 * @function updateTicketStatus
 * @description Updates the status of a ticket.
 * @param {string} status - The new status to set for the ticket.
 */
async function updateTicketStatus(status) {
  try {
    const ticketId = $(domElements.ticketId).html();
    if (!ticketId) {
      throw new Error("Ticket ID is missing.");
    }

    let ticketHead = await TicketApi.getTicketHeadById(ticketId);
    if (!ticketHead) {
      throw new Error("Ticket not found.");
    }

    ticketHead.status = status;
    await TicketApi.updateTicketHead(ticketId, ticketHead);

    showSuccess("Ticket status updated successfully!");
    loadTicketHead(); // Reload the ticket list
    loadTicketDetail(ticketId); // Refresh detail
  } catch (error) {
    console.error("Error updating ticket status:", error);
    showError(`Failed to update ticket status: ${error.message}`);
  }
}

/**
 * @function responseTicket
 * @description Adds a new comment to a ticket.
 */
async function responseTicket() {
  try {
    const commentText = $(domElements.commentInput).val().trim();
    if (!commentText) {
      showError("Comment cannot be empty!");
      return;
    }

    const head_id = $(domElements.ticketId).html();
    if (!head_id) {
      throw new Error("Ticket ID is missing.");
    }

    const existedResponse = await TicketApi.getTicketsByCondition({
      head_id: head_id,
    });

    existedResponse.sort(
      (a, b) =>
        new Date(b.ticket_last_updated_date) -
        new Date(a.ticket_last_updated_date)
    );

    const responseOrder = existedResponse[0]?.responseOrder
      ? existedResponse[0].responseOrder + 1
      : 1;

    const responseInput = {
      ticket_head_id: head_id,
      response: commentText,
      created_by: loginUser.user_id,
      reponse_order: responseOrder,
    };

    await TicketApi.createTicketDetail(responseInput);

    showSuccess("Reply Posted!");
    $(domElements.commentInput).val(""); // Clear the input

    loadTicketDetail(head_id); // Reload detail
  } catch (error) {
    console.error("Error adding comment:", error);
    showError("Failed to add comment!");
  }
}

/**
 * @function searchTicket
 * @description Searches for tickets based on specified criteria and updates the ticket list.
 */
async function searchTicket() {
  try {
    init(); // Hide the ticket details section
    const searchTitle = $(domElements.searchTicket).val();
    const searchDepartment = $(domElements.searchDepartment).val();
    const searchStatus = $(domElements.searchTicketStatus).val();

    // Decide user ID based on permissions
    const searchUserId = accessVerify("Ticket Full Access")
      ? null
      : loginUser.user_id;

    const filters = {
      ticket_topic: searchTitle,
      department_id: searchDepartment,
      status: searchStatus,
      user_id: searchUserId,
    };
    //get ticket heads.
    let ticketHead = await TicketApi.getTicketHeadViewByCondition(filters);

    //sort the list
    ticketHead.sort(
      (a, b) =>
        new Date(b.ticket_last_updated_date) -
        new Date(a.ticket_last_updated_date)
    );

    const ticketTableBody = ticketHead
      .map((ticket) => {
        const statusClass = getStatusBadgeClass(
          ticket.ticket_status_name.toLowerCase()
        );

        return `
                    <tr class="ticket-row" data-id="${ticket.ticket_id}">
                        <td>${ticket.ticket_id}</td>
                        <td>${ticket.ticket_topic}</td>
                        <td><span class="badge ${statusClass}">${
          ticket.ticket_status_name
        }</span></td>
                        <td>${ticket.department_name}</td>
                        <td>${ticket.ticket_request_by_name}</td>
                        <td>${formatDate(ticket.ticket_last_updated_date)}</td>
                    </tr>
                `;
      })
      .join("");

    $(domElements.ticketTableBody).html(ticketTableBody);
  } catch (error) {
    console.error("Error searching tickets:", error);
    showError("Failed to search tickets.");
  }
}

/**
 * @function setupEventListeners
 * @description Sets up event listeners for various actions.
 */
function setupEventListeners() {
  // Create Ticket Submission
  $(domElements.submitTicket).on("click", (e) => {
    e.preventDefault();
    createTicket();
  });

  // Ticket Row Click (Load Details)
  $(domElements.ticketTableBody).on("click", ".ticket-row", function () {
    const id = $(this).data("id");
    loadTicketDetail(id);
  });

  // Update Ticket Status Buttons
  $(".btn-update-status").on("click", function () {
    const status = $(this).data("status");
    updateTicketStatus(status);
  });

  // Post Comment
  $(domElements.postComment).on("click", (e) => {
    e.preventDefault();
    responseTicket();
  });

  // Search Tickets
  $(domElements.searchForm).on("submit", (e) => {
    e.preventDefault();
    searchTicket();
  });
}

/**
 * @function initializePage
 * @description Initializes the page by loading user data, populating dropdowns, and setting up event listeners.
 */
async function initializePage() {
  try {
    loginUser = JSON.parse(sessionStorage.getItem("user"));
    if (!loginUser) {
      showError("User not logged in. Please log in again.");
      // Consider redirecting to login page
      return;
    }

    loggedInEmployee = await EmployeeApi.getTaskByUserId(loginUser.user_id);
    if (!loggedInEmployee) {
      showError("Employee data not found. Contact administrator.");
      return;
    }

    //access
    if (!accessVerify("Ticket Full Access")) {
      $(domElements.searchDepartment).prop("disabled", true);
    }

    // Populate dropdowns (fetch data concurrently)
    await Promise.all([
      populateDropdown(domElements.searchDepartment, "department"),
      populateDropdown(domElements.searchTicketStatus, "ticket_status"),
      populateDropdown(domElements.addTicketDepartment, "department"),
    ]);

    loadTicketHead(); // Load initial ticket list
    setupEventListeners(); // Attach event listeners
  } catch (error) {
    console.error("Page initialization error:", error);
    showError("Failed to initialize the page.");
  }
}

// --- Document Ready ---
$(document).ready(initializePage);
