// const employeeApi = await import("./services/employeeServices.js");
// const objectTypeApi = await import("./services/objectTypeServices.js");
// const parentTaskApi = await import("./services/parentTaskServices.js");
// const childTaskApi = await import("./services/childTaskServices.js");
// const userApi = await import("./services/userServices.js");
// const userParentTaskApi = await import("./services/relUserParentTaskServices.js");
// const userChildTaskApi = await import("./services/relUserChildTaskServices.js");

import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskApi from "./services/childTaskServices.js";
import * as UserApi from "./services/userServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";

$(document).ready(async function () {
   
  // Populate the department dropdown
  function populateDepartmentOptions() {
    const departments = objectTypeApi.getTaskByName('department') || [];
    const departmentOptions = departments.map(dept => `<option value="${dept.object_type_item_key}">${dept.object_type_item_value}</option>`).join("");
    // Populate both main form and edit modal
    $("#department, #edit-department").html(departmentOptions);
  }

  // Call the function to populate department options when the page is ready
  populateDepartmentOptions();

  // Load existing employees into the table
  function loadEmployees() {
    employeeApi.getTasks
      .then((employees) => {
        let rows = employees
          .map((emp) => {
            const department =
              objectTypeApi
                .getTaskByName("department")
                .find((dept) => dept.object_type_item_key == emp.department_id)
                ?.object_type_item_value || "Unknown";

            const status =
              objectTypeApi
                .getTaskByName("employee_status")
                .find((s) => s.object_type_item_key == emp.status)
                ?.object_type_item_value || "Unknown";

            return `
            <tr>
              <td>${emp.id}</td>
              <td>${emp.first_name}</td>
              <td>${emp.last_name}</td>
              <td>${department}</td>
              <td>${status}</td>
              <td hidden>${emp.user_id}</td>
              <td>
                <button class="btn btn-sm btn-primary edit-btn" data-id="${emp.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${emp.id}">Delete</button>
              </td>
            </tr>
          `;
          })
          .join("");

        $("#employee-table-body").html(rows);
      })
      .catch((error) => {
        console.error("Error loading employees:", error);
      });
  }
  loadEmployees();

  // Attach event directly to existing buttons
  $(".start-onboarding-btn").on("click", function () {
    const userId = $(this).data("id");
    // Find the task group for onboarding
    const taskGroup = objectTypeApi
      .getTaskByName("task_group")
      .find((o) => o.task_group_id == "1");

    if (!taskGroup) {
      console.error("TaskGroup 'Onboard' not found.");
      return;
    }

    // Filter tasks for the found task group
    const parentTask = parentTaskApi
      .getTasks()
      .filter((t) => t.task_group_id === taskGroup.id);

    const childTask = childTaskApi
      .getTaskByParentTaskId()
      .filter((ct) =>
        parentTask.some((pt) => ct.parent_task_id === pt.task_id)
      );

    parentTask.forEach((t) => {
      // Create user-task-head
      const userParentTask = {
        user_id: userId,
        parent_task_id: t.task_id, // `task_id` should be the `id` from `tasks`
        status: 0,
        count_child_tasks: childTask.length,
        start_date: null,
      };
      userParentTaskApi.createTask(userParentTask);
      //insert table

      //child task
      childTask.forEach((s) => {
        // Create user-task-detail
        const userChildTask = {
          user_parenttask_id: -1,
          user_childtask_id: s.id,
          status: 0,
          document_id: s.document_id || null,
          document_path: "",
          equipment_type_id: s.equipment_type_id || null,
          equipment_id: null,
          trainning_module_id: s.training_module_id || null,
          acess_provisioning_id: s.acess_provisioning_id || null,
          interview_id: s.interview_id || null,
          server_id: s.server_id || null,
          hand_over_id: s.hand_over_id || null,
          start_date: null,
        };

        userChildTaskApi.createTask(userChildTask);
      });
    });
  });

  // Add a new employee
  $("#employee-form").on("submit", function (e) {
    e.preventDefault();

    const newUser = {
      username: `${$("#first-name").val()}_${$(
        "#last-name"
      ).val()}`.toLowerCase(),
      password: `${$("#first-name").val()}_${$(
        "#last-name"
      ).val()}`.toLowerCase(),
      role: "user", //get from combo box
    };
    userApi.createTask(newUser);
    const user = userApi.getTaskByName(newUser.username);

    const newEmployee = {
      id: employees.length + 1,
      first_name: $("#first-name").val(),
      last_name: $("#last-name").val(),
      department_id: $("#department").val(),
      status: $("#status").val(),
      phone: $("#phone").val(),
      address: $("#address").val(),
      user_id: user.userId, // Example user ID, adjust as necessary
    };

    employeeApi.createTask(newEmployee);
    loadEmployees();
    this.reset();
  });

  // Edit an employee
  $("#employee-table-body").on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    const employee = employees.find((emp) => emp.id == id);

    // Populate the department dropdown with the department names
    const departmentOptions = object_type
      .filter((dept) => dept.object == "Department")
      .map((dept) => {
        return `<option value="${dept.id}" ${
          dept.id == employee.department_id ? "selected" : ""
        }>${dept.object_type}</option>`;
      })
      .join("");

    // Append the default option and the department options to the dropdown
    $("#edit-department").html(
      `<option value="" disabled selected>Select a department</option>` +
        departmentOptions
    );

    // Populate the modal with employee data
    $("#edit-first-name").val(employee.first_name);
    $("#edit-last-name").val(employee.last_name);
    $("#edit-status").val(employee.status);
    $("#edit-phone").val(employee.phone);
    $("#edit-address").val(employee.address);
    $("#edit-employee-id").val(employee.id);

    // Show the modal
    $("#editModal").modal("show");
  });

  // Save edited employee data
  $("#edit-employee-form").on("submit", function (e) {
    e.preventDefault();

    const id = $("#edit-employee-id").val();
    const employee = employees.find((emp) => emp.id == id);

    // Update the employee data
    employee.first_name = $("#edit-first-name").val();
    employee.last_name = $("#edit-last-name").val();
    employee.department_id = $("#edit-department").val();
    employee.status = $("#edit-status").val();
    employee.phone = $("#edit-phone").val();
    employee.address = $("#edit-address").val();
    employee.last_updated_date = new Date().toISOString();

    // Reload the employee table with updated data
    loadEmployees();

    // Close the modal
    $("#editModal").modal("hide");
  });
});
