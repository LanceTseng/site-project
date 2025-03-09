import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as UserPaymentApi from "./services/uesrPaymentServices.js";
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

function addDropdown(list, selectedItem) {
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

  return `<select class="form-control" id="paymentType" disabled>${options}</select>`;
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

async function loadEmployeePayment() {
  try {
    const searchName = $("#searchName").val() ?? "";
    const searchDepartment = $("#searchDepartment").val() ?? "";
    const searchStatus = $("#searchStatus").val() ?? "";

    const response = await UserPaymentApi.getUserPaymentViewByCondition({
      name: searchName,
      department: searchDepartment,
      status: searchStatus,
    });

    const paymentTableBody = $("#paymentTableBody");
    paymentTableBody.empty();

    // Fetch payment types once (avoid multiple calls inside loop)
    const paymentTypes = await ObjectTypeApi.getTaskByName("payment_type");

    // Use `map()` to construct rows
    const rows = await Promise.all(
      response.map(async (payment) => {
        const userIdField = addTDTag(payment.user_id ?? "-");
        const firstNameField = addTDTag(payment.employee_first_name ?? "-");
        const lastNameField = addTDTag(payment.employee_last_name ?? "-");
        const statusField = addTDTag(payment.employee_status_name ?? "-");
        const paymentTypeField = addTDTag(
          addDropdown(paymentTypes, payment.payment_type_id)
        );
        const annualSalaryField = addTDTag(
          addInputText(payment.annual_salary, "AnnualSalary")
        );
        const weeklyWorkHoursField = addTDTag(
          addInputText(payment.weekly_work_hours, "WeeklyWorkHours")
        );
        const terminationPayField = addTDTag(
          addInputText(payment.termination_pay, "TerminationPay")
        );
        const createdAtField = addTDTag(
          formatDate(payment.created_at),
          "createdDate"
        );
        const updatedAtField = addTDTag(
          formatDate(payment.updated_at),
          "updatedDate"
        );

        // Action buttons (Edit & Save) with event binding
        const actionField = `<td>
       <button class="btn btn-secondary btn-sm mx-1 edit-btn" data-id="${
         payment.payment_id ?? "-1"
       }">Edit</button>
       <button class="btn btn-primary btn-sm mx-1 save-btn" data-id="${
         payment.payment_id ?? "-1"
       }" data-userid="${payment.user_id}" disabled>Save</button>
     </td>`;

        return `<tr data-id="${payment.payment_id ?? "-1"}">
          ${userIdField}
          ${firstNameField}
          ${lastNameField}
          ${statusField}
          ${paymentTypeField}
          ${annualSalaryField}
          ${weeklyWorkHoursField}
          ${terminationPayField}
          ${createdAtField}
          ${updatedAtField}
            ${actionField}
        </tr>`;
      })
    );

    // Append all rows at once
    paymentTableBody.append(rows.join(""));
  } catch (error) {
    console.error("Error loading payments:", error);
    alert("Failed to load employee payments.");
  }
}

function editField(row) {
  row.find("input, select").prop("disabled", false); // Enable form fields
  row.find(".save-btn").prop("disabled", false); // Enable Save button
}

$(document).ready(function () {
  populateDropdown("#searchDepartment", "department");
  populateDropdown("#searchStatus", "employee_status");

  loadEmployeePayment();

  $("#btnSearch").click((e) => {
    e.preventDefault();
    loadEmployeePayment();
  });

  $("#paymentTableBody").on("click", ".edit-btn", function () {
    const row = $(this).closest("tr");
    editField(row);
  });

  $("#paymentTableBody").on("click", ".save-btn", async function () {
    const row = $(this).closest("tr");
    const paymentId = $(this).data("id");
    const userId = $(this).data("userid");

    // Collect updated payment data from input fields
    const updatedPayment = {
      id: paymentId,
      user_id: userId,
      annual_pay: row.find("#input-AnnualSalary").val().trim(),
      work_hours_per_week: row.find("#input-WeeklyWorkHours").val().trim(),
      termination_pay: row.find("#input-TerminationPay").val().trim(),
      payment_type_id: row.find("#paymentType").val(),
    };

    try {
      // API call to update payment details
      if (paymentId == -1) {
        delete updatedPayment.id;

        const response = await UserPaymentApi.createRelUserPayment(
          updatedPayment
        );
        row.find("#text-createdDate").text(formatDate(response.created_date));
        row
          .find("#text-updatedDate")
          .text(formatDate(response.last_updated_date));
      } else {
        const response = await UserPaymentApi.updateRelUserPayment(
          paymentId,
          updatedPayment
        );

        row
          .find("#text-updatedDate")
          .text(formatDate(response.last_updated_date));
      }

      Swal.fire("Success", `Payment edited successfully!`, "success");
    } catch (error) {
      console.error("Error updating payment:", error);
      Swal.fire("Error", error.message, "error");
    }

    // Disable input fields and Save button after saving
    row.find("input, select").prop("disabled", true);
    row.find(".save-btn").prop("disabled", true);
  });
});
