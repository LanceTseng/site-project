import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as TicketApi from "./services/ticketServices.js";
import * as EmployeeApi from "./services/employeeServices.js";
import { accessVerify } from "./utils/authVerify.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

let loginUser = "";
let logineEmp = "";

function init() {
  $("#btnProcessing").hide();
  $("#btnCompleted").hide();
  $("#btnCancel").hide();
  $("#btnReject").hide();
  $("#btnReOpen").hide();
}

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

async function loadTicketHead() {
  const ticketHead = await TicketApi.getAllTicketHeadView();

  ticketHead.sort(
    (a, b) =>
      new Date(b.ticket_last_updated_date) -
      new Date(a.ticket_last_updated_date)
  );

  const statusClasses = {
    completed: "bg-success text-white",
    new: "bg-info",
    processing: "bg-warning",
    cancelled: "bg-danger text-white",
    reject: "bg-secondary text-white",
  };

  const ticketTableBody = ticketHead
    .map((ticket) => {
      const statusClass =
        statusClasses[ticket.ticket_status_name.toLowerCase()] ||
        "bg-secondary";

      return `
                <tr class="ticket-row" data-id="${ticket.ticket_id}">
                    <td>${ticket.ticket_id}</td>
                    <td>${ticket.ticket_topic}</td>
                    <td class="badge ${statusClass} fw-bold">${ticket.ticket_status_name.toUpperCase()}</td>
                    <td>${ticket.department_name}</td>
                    <td>${ticket.ticket_request_by_name}</td>
                    <td>${new Date(
                      ticket.ticket_last_updated_date
                    ).toLocaleDateString()}</td>
                </tr>
            `;
    })
    .join("");

  $("#ticketTableBody").html(ticketTableBody);
}

async function loadTicketDetail(id) {
  init();
  const response = await TicketApi.getTicketsByCondition({ head_id: id });
  response.sort(
    (a, b) =>
      new Date(b.ticket_last_updated_date) -
      new Date(a.ticket_last_updated_date)
  );
  const ticketHead = response[0];

  $("#ticketTitle").html(ticketHead.ticket_topic);
  $("#ticketDescription").html(ticketHead.ticket_description);
  $("#ticketId").html(ticketHead.ticket_id);

  //action btn
  if (isEqualIgnoreCase(ticketHead.ticket_status_name, "new")) {
    if (ticketHead.ticket_department_id == logineEmp.department_id) {
      $("#btnProcessing").show();
    }
    if (ticketHead.ticket_request_by_id == loginUser.user_id) {
      $("#btnCancel").show();
    }
  }
  if (isEqualIgnoreCase(ticketHead.ticket_status_name, "processing")) {
    if (ticketHead.ticket_department_id == logineEmp.department_id) {
      $("#btnReject").show();
      $("#btnCompleted").show();
    }
  }
  if (isEqualIgnoreCase(ticketHead.ticket_status_name, "reject")) {
    if (ticketHead.ticket_request_by_id == loginUser.user_id) {
      $("#btnCancel").show();
      $("#btnReOpen").show();
    }
    $("#response-area").hide();
  }
  if (
    isEqualIgnoreCase(ticketHead.ticket_status_name, "completed") ||
    isEqualIgnoreCase(ticketHead.ticket_status_name, "cancelled")
  ) {
    $("#response-area").hide();
  }

  //render existed response
  const commentsSection = response
    .map(
      (comment) => `
            <div class="card p-2 mt-2">
                   <p> <strong>${comment.response_by_name ?? ""}</strong></p>
                    <p>${comment.response_text ?? ""}</p>
                     <p>${comment.response_date ?? ""}</p>
            </div>
        `
    )
    .join("");

  $("#commentsSection").html(commentsSection);
}

async function createTicket() {
  const title = $("#addTicketTitle").val().trim();
  const department = $("#addTicketDepartment").val();
  const description = $("#addTicketDescription").val().trim();

  if (!title || !department || !description) {
    Swal.fire("Error", "Please fill in all fields!", "error");
    return;
  }

  await TicketApi.createTicketHead({
    ticket_topic: title,
    description: description,
    ticket_department_id: department,
    status: 1,
    created_by: loginUser.user_id,
  });

  Swal.fire("Success", `Ticket created successfully!`, "success");

  loadTicketHead();
}

async function updateTicketStatus(status) {
  try {
    const ticketId = $("#ticketId").html();
    let ticketHead = await TicketApi.getTicketHeadById(ticketId);
    ticketHead.status = status;

    await TicketApi.updateTicketHead(ticketId, ticketHead);

    Swal.fire("Success", `Ticket status updated successfully!`, "success");

    loadTicketHead();
    loadTicketDetail(ticketId);
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
}

async function responseTicket() {
  try {
    const commentText = $("#commentInput").val().trim();
    if (!commentText) {
      Swal.fire("Error", "Comment cannot be empty!", "error");
      return;
    }

    const head_id = $("#ticketId").html();
    const existedResponse = await TicketApi.getTicketsByCondition({
      head_id: head_id,
    });

    existedResponse.sort(
      (a, b) =>
        new Date(b.ticket_last_updated_date) ||
        0 - new Date(a.ticket_last_updated_date) ||
        0
    );

    const responseOrder = existedResponse[0].responseOrder
      ? existedResponse[0].responseOrder + 1
      : 1;

    const responseInput = {
      ticket_head_id: head_id,
      response: commentText,
      created_by: loginUser.user_id,
      reponse_order: responseOrder,
    };
    await TicketApi.createTicketDetail(responseInput);

    Swal.fire("Success", "Reply Posted!", "success");
    $("#commentInput").val("");

    loadTicketDetail(head_id);
  } catch (error) {
    console.error("Error adding comment:", error);
    Swal.fire("Error", "Failed to add comment!", "error");
  }
}

async function searchTicket() {
  const searchTitle = $("#searchTicket").val();
  const searchDepartment = $("#searchDepartment").val();
  const searchStatus = $("#searchTicketStatus").val();

  let ticketHead = await TicketApi.getTicketHeadViewByCondition({
    ticket_topic: searchTitle,
    department_id: searchDepartment,
    status: searchStatus,
  });

  ticketHead.sort(
    (a, b) =>
      new Date(b.ticket_last_updated_date) -
      new Date(a.ticket_last_updated_date)
  );

  const statusClasses = {
    completed: "bg-success text-white",
    new: "bg-info",
    processing: "bg-warning",
    cancelled: "bg-danger text-white",
    reject: "bg-secondary text-white",
  };

  const ticketTableBody = ticketHead
    .map((ticket) => {
      const statusClass =
        statusClasses[ticket.ticket_status_name.toLowerCase()] ||
        "bg-secondary";

      return `
                    <tr class="ticket-row" data-id="${ticket.ticket_id}">
                        <td>${ticket.ticket_id}</td>
                        <td>${ticket.ticket_topic}</td>
                        <td class="badge ${statusClass} fw-bold">${ticket.ticket_status_name.toUpperCase()}</td>
                        <td>${ticket.department_name}</td>
                        <td>${ticket.ticket_request_by_name}</td>
                        <td>${new Date(
                          ticket.ticket_last_updated_date
                        ).toLocaleDateString()}</td>
                    </tr>
                `;
    })
    .join("");

  $("#ticketTableBody").html(ticketTableBody);
}

$(document).ready(async function () {
  loginUser = JSON.parse(sessionStorage.getItem("user"));
  logineEmp = await EmployeeApi.getTaskByUserId(loginUser.user_id);

  //init
  init();

  // Populate dropdowns
  populateDropdown("#searchDepartment", "department");
  populateDropdown("#searchTicketStatus", "ticket_status");
  populateDropdown("#addTicketDepartment", "department");

  loadTicketHead();

  // Submit Ticket
  $("#submitTicket").click(function (e) {
    e.preventDefault();
    createTicket();
  });

  //Load ticket detail
  $("#ticketTableBody").on("click", ".ticket-row", function () {
    const id = $(this).attr("data-id"); // Fixed selector
    loadTicketDetail(id);
  });

  $(".btn-update-status").click((event) => {
    const status = $(event.target).attr("data-status");

    updateTicketStatus(status);
  });

  // Post a Reply
  $("#postComment").click(function (e) {
    e.preventDefault();

    responseTicket();
  });

  $("#btnSearch").click((e) => {
    e.preventDefault();
    searchTicket();
  });
});
