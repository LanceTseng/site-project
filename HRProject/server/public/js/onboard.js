import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskApi from "./services/childTaskServices.js";
import * as UserApi from "./services/userServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import * as EmployeeViewApi from "./services/employeeViewService.js";
import { isEqualIgnoreCase } from "./utils/stringUtils.js";

$(document).ready(async function () {
  /** 🛠️ Utility Functions **/
  const handleError = (error, message) => console.error(message, error);

  /** 🔽 Populate Dropdowns **/
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

  await populateDropdown("#department, #edit-department", "department");
  await populateDropdown("#status, #edit-status", "employee_status");

  /** 🧑‍💼 Load Employees **/
  async function loadEmployees() {
    try {
      const employees = await EmployeeViewApi.getTasks(); // Fetch employee data

      const rows = employees
        .map((emp) => {
        
          return `
            <tr>
              <td>${emp.employee_id}</td>
              <td>${emp.first_name}</td>
              <td>${emp.last_name}</td>
              <td>${emp.department_name}</td>
              <td>${emp.status_name}</td>
              <td hidden>${emp.link_user_id}</td>
              <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${
                  emp.employee_id
                }">Edit</button>
                ${
                  isEqualIgnoreCase(emp.status_name, "pending")
                    ? `<button class="btn btn-sm btn-success start-onboarding-btn" data-id="${emp.link_user_id}">Start Onboarding</button>`
                    : ""
                }
              </td>
            </tr>
          `;
        })
        .join(""); // Convert array to a string

      $("#employee-table-body").html(rows); // Inject rows into the table body
    } catch (error) {
      handleError(error, "Error loading employees");
    }
  }

  await loadEmployees();

  /** 🚀 Onboarding Process **/
  $("#employee-table-body").on(
    "click",
    ".start-onboarding-btn",
    async function () {
      const userId = $(this).data("id");

      try {
        const taskGroup =
          (await ObjectTypeApi.getTaskByName("task_group")) || [];
        const onboardGroup = taskGroup.find(
          (o) => o.object_type_item_value.toLowerCase() === "onboard"
        );

        if (!onboardGroup) throw new Error("TaskGroup 'Onboard' not found.");

        const parentTasks = await ParentTaskApi.getTaskByGroupId(
          onboardGroup.object_type_item_key
        );
        if (!parentTasks.length) throw new Error("Parent tasks not found.");

        for (const parent of parentTasks) {
          const childTasks = await ChildTaskApi.getTaskByParentTaskId(
            parent.task_id
          );
          console.log(childTasks);
          const countChildTasks = childTasks?.length || 0;

          const userParentTask = await UserParentTaskApi.createTask({
            user_id: userId,
            parent_task_id: parent.task_id,
            status: 0,
            count_child_tasks: countChildTasks,
          });

          for (const child of childTasks) {
            await UserChildTaskApi.createTask({
              user_parenttask_id: userParentTask.id,
              child_task_id: child.child_task_id,
              status: 0,
              document_id: child.document_id || null,
              document_path: "",
              equipment_type_id: child.equipment_type_id || null,
              training_module_id: child.training_module_id || null,
              access_provisioning_id: child.access_provisioning_id || null,
              interview_id: child.interview_id || null,
              server_id: child.server_id || null,
              hand_over_id: child.hand_over_id || null
            });
          }
        }

        const emp = await EmployeeApi.getTaskById(userId);
        emp.status = 1;//onboarding
        await EmployeeApi.updateTask(emp.employee_id, emp);

        // Show success message
        $("#onboarding-alert")
          .html(
            `<div class="alert alert-success alert-dismissible fade show" role="alert">
        Onboarding process has started successfully for ${emp.first_name} ${emp.last_name}.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`
          )
          .show();

        // Hide the message after 3 seconds
        setTimeout(() => {
          $("#onboarding-alert").hide();
        }, 3000);

        await loadEmployees();
      } catch (error) {
        handleError(error, "Error in onboarding process");
      }
    }
  );

  /** ➕ Add New Employee **/
  $("#employee-form").on("submit", async function (e) {
    e.preventDefault();

    try {
      const firstName = $("#first-name").val();
      const lastName = $("#last-name").val();
      const department = $("#department").val();
      const username = `${firstName}_${lastName}`.toLowerCase();

      const newUser = await UserApi.createTask({
        username,
        password: username,
        role_id: department,
        is_active: true,
      });

      await EmployeeApi.createTask({
        first_name: firstName,
        last_name: lastName,
        department_id: department,
        status: 0,
        phone: $("#phone").val(),
        address: $("#address").val(),
        is_active: true,
        link_user_id: newUser.user_id,
      });

      await loadEmployees();
      this.reset();
    } catch (error) {
      handleError(error, "Error adding employee");
    }
  });

  /** ✏️ Edit Employee **/
  $("#employee-table-body").on("click", ".edit-btn", async function () {
    try {
      const id = $(this).data("id");
      const employee = await EmployeeApi.getTaskById(id);

      if (!employee) throw new Error("Employee not found.");

      await populateDropdown("#edit-department", "department");
      await populateDropdown("#edit-status", "employee_status");

      $("#edit-first-name").val(employee.first_name);
      $("#edit-last-name").val(employee.last_name);
      $("#edit-phone").val(employee.phone);
      $("#edit-address").val(employee.address);
      $("#edit-employee-id").val(employee.employee_id);
      $("#edit-department").val(employee.department_id);
      $("#edit-status").val(employee.status);

      $("#editModal").modal("show");
    } catch (error) {
      handleError(error, "Error fetching employee details");
    }
  });

  /** 💾 Save Edited Employee **/
  $("#edit-employee-form").on("submit", async function (e) {
    e.preventDefault();

    try {
      const id = $("#edit-employee-id").val();
      const employee = await EmployeeApi.getTaskById(id);

      if (!employee) throw new Error("Employee not found.");

      await EmployeeApi.updateTask(id, {
        first_name: $("#edit-first-name").val(),
        last_name: $("#edit-last-name").val(),
        department_id: $("#edit-department").val(),
        status: $("#edit-status").val(),
        phone: $("#edit-phone").val(),
        address: $("#edit-address").val(),
      });

      await loadEmployees();
      $("#editModal").modal("hide");
    } catch (error) {
      handleError(error, "Error updating employee");
    }
  });
});
