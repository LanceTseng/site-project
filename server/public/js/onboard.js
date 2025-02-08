import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskApi from "./services/childTaskServices.js";
import * as UserApi from "./services/userServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import { isEqualIgnoreCase } from "./utils/stringUtils.js";

$(document).ready(async function () {
  // Populate the department dropdown
  async function populateDepartmentOptions() {
    try {
      const departments =
        (await ObjectTypeApi.getTaskByName("department")) || [];
      const departmentOptions = departments
        .map(
          (dept) =>
            `<option value="${dept.object_type_item_key}">${dept.object_type_item_value}</option>`
        )
        .join("");
      $("#department, #edit-department").html(departmentOptions);
    } catch (error) {
      console.error("Error populating departments:", error);
    }
  }

  await populateDepartmentOptions();

  // Load existing employees into the table
  async function loadEmployees() {
    try {
      const employees = await EmployeeApi.getTasks();
      const departments =
        (await ObjectTypeApi.getTaskByName("department")) || [];
      const statuses =
        (await ObjectTypeApi.getTaskByName("employee_status")) || [];

      let rows = employees
        .map((emp) => {
          const department =
            departments.find(
              (dept) => dept.object_type_item_key == emp.department_id
            )?.object_type_item_value || "Unknown";
          const status =
            statuses.find((s) => s.object_type_item_key == emp.status)
              ?.object_type_item_value || "Unknown";

          return `
              <tr>
                <td>${emp.employee_id}</td>
                <td>${emp.first_name}</td>
                <td>${emp.last_name}</td>
                <td>${department}</td>
                <td>${status}</td>
                <td hidden>${emp.link_user_id}</td>
                <td>
                  <button class="btn btn-sm btn-primary edit-btn" data-id="${emp.employee_id}">Edit</button>
                  <button class="btn btn-sm btn-success start-onboarding-btn" data-id="${emp.link_user_id}">Start Onboarding</button>
                </td>
              </tr>
            `;
        })
        .join(""); //to_do: check if status = pending show the start onboarding btn

      $("#employee-table-body").html(rows);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  }

  await loadEmployees();

  // Attach event to onboarding button
  $(".start-onboarding-btn").on("click", async function () {
    const userId = $(this).data("id");

    try {
      const taskGroupId =
        (await ObjectTypeApi.getTaskByName("task_group")).find(
          (o) => o.object_type_item_value.toLowerCase() == "onboard"
        ).object_type_item_key || [];
      if (!taskGroupId) {
        console.error("TaskGroup 'Onboard' not found.");
        return;
      }

      const parentTask = await ParentTaskApi.getTaskByGroupId(taskGroupId);
      if (!parentTask) {
        console.error("Parent tasks not found.");
        return;
      }

      for (const t of parentTask) {
        //get child task
        const childTask = await ChildTaskApi.getTaskByParentTaskId(t.task_id);

        const countChildTasks = Array.isArray(childTask)
          ? childTask.length
          : Object.keys(childTask).length; // Count object keys if it's an object

        const userParentTask = {
          user_id: userId,
          parent_task_id: t.task_id,
          status: 0,
          count_child_tasks: countChildTasks,
        };
        const response = await UserParentTaskApi.createTask(userParentTask);

        for (const s of childTask) {
          const userChildTask = {
            user_parenttask_id: response.id || -1,
            child_task_id: s.child_task_id,
            status: 0,
            document_id: s.document_id || null,
            document_path: "",
            equipment_type_id: s.equipment_type_id || null,
            equipment_id: null,
            training_module_id: s.training_module_id || null,
            access_provisioning_id: s.access_provisioning_id || null,
            interview_id: s.interview_id || null,
            servery_id: s.server_id || null,
            hand_over_id: s.hand_over_id || null,
            start_date: null,
            end_date: null,
          };

          await UserChildTaskApi.createTask(userChildTask);
        }
      }
    } catch (error) {
      console.error("Error in onboarding process:", error);
    }
  });

  // Add a new employee
  $("#employee-form").on("submit", async function (e) {
    e.preventDefault();

    try {
      const username = `${$("#first-name").val()}_${$(
        "#last-name"
      ).val()}`.toLowerCase();
      const role = $("#department").val();

      const newUser = {
        username: username,
        password: username,
        role_id: role,
        is_active: true,
      };
      const userResponse = await UserApi.createTask(newUser);

      const newEmployee = {
        first_name: $("#first-name").val(),
        last_name: $("#last-name").val(),
        department_id: $("#department").val(),
        status: 0,
        phone: $("#phone").val(),
        address: $("#address").val(),
        is_active: true,
        link_user_id: userResponse.user_id, // Ensure user exists before accessing property
      };

      await EmployeeApi.createTask(newEmployee);
      await loadEmployees();
      this.reset();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  });

  // Edit an employee
  $("#employee-table-body").on("click", ".edit-btn", async function () {
    const id = $(this).data("id");

    const employee = await EmployeeApi.getTaskById(id);
    if (!employee) {
      console.error("Employee not found.");
      return;
    }

    const departments = await ObjectTypeApi.getTaskByName("department");
    const departmentOptions = departments
      .map(
        (dept) =>
          `<option value="${dept.object_type_item_key}" ${
            dept.object_type_item_key == employee.department_id
              ? "selected"
              : ""
          }>${dept.object_type_item_value}</option>`
      )
      .join("");

    const status = await ObjectTypeApi.getTaskByName("employee_status");
    const statusOptions = status
      .map(
        (s) =>
          `<option value="${s.object_type_item_key}" ${
            s.object_type_item_key == employee.status ? "selected" : ""
          }>${s.object_type_item_value}</option>`
      )
      .join("");

    $("#edit-department").html(
      `<option value="" disabled selected>Select a department</option>` +
        departmentOptions
    );

    $("#edit-first-name").val(employee.first_name);
    $("#edit-last-name").val(employee.last_name);
    $("#edit-status").html(
      `<option value="" disabled selected>Select a Status</option>` +
        statusOptions
    );
    $("#edit-phone").val(employee.phone);
    $("#edit-address").val(employee.address);
    $("#edit-employee-id").val(employee.employee_id);

    $("#editModal").modal("show");
  });

  // Save edited employee data
  $("#edit-employee-form").on("submit", async function (e) {
    e.preventDefault();

    try {
      const id = $("#edit-employee-id").val();
      const employee = await EmployeeApi.getTaskById(id);

      if (!employee) {
        console.error("Employee not found.");
        return;
      }

      employee.first_name = $("#edit-first-name").val();
      employee.last_name = $("#edit-last-name").val();
      employee.department_id = $("#edit-department").val();
      employee.status = $("#edit-status").val();
      employee.phone = $("#edit-phone").val();
      employee.address = $("#edit-address").val();

      const response = await EmployeeApi.updateTask(id, employee);

      await loadEmployees();
      $("#editModal").modal("hide");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  });
});
