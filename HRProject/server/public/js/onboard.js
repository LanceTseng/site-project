import {
  employees,
  object_type,
  user_task_head,
  users,
  user_task_detail,
  tasks,
  subtasks,
} from "./mockdata.js";

$(document).ready(function () {
  // Populate the department dropdown
  function populateDepartmentOptions() {
    const departmentOptions = object_type
      .filter((item) => item.object === "Department")
      .map((dept) => `<option value="${dept.id}">${dept.object_type}</option>`)
      .join("");
    // Populate both main form and edit modal
    $("#department, #edit-department").html(departmentOptions);
  }

  // Call the function to populate department options when the page is ready
  populateDepartmentOptions();

  // Load existing employees into the table
  function loadEmployees() {
    const rows = employees
      .map((emp) => {
        // Find the department name by matching the department_id
        const department =
          object_type.find((dept) => dept.id == emp.department_id)
            ?.object_type || "Unknown";

        return `
          <tr>
            <td>${emp.id}</td>
            <td>${emp.first_name}</td>
            <td>${emp.last_name}</td>
            <td>${department}</td>  
            <td>${emp.status}</td>
            <td hidden>${emp.user_id}</td>
            <td>
              <button class="btn btn-sm btn-primary edit-btn" data-id="${emp.id}">Edit</button>
              <button class="btn btn-sm btn-info start-onboarding-btn" data-id="${emp.user_id}">Start Onboarding</button>
            </td>
          </tr>
        `;
      })
      .join("");

    $("#employee-table-body").html(rows);
  }

  loadEmployees();

  // Attach event directly to existing buttons
  $(".start-onboarding-btn").on("click", function () {

    const userId = $(this).data("id");
    // Find the task group for onboarding
    const taskGroup = object_type.find(
      (o) => o.object == "TaskGroup" && o.object_type == "Onboard"
    );

    if (!taskGroup) {
      console.error("TaskGroup 'Onboard' not found.");
      return;
    }

    // Filter tasks for the found task group
    const topTasks = tasks.filter((t) => t.task_group_id === taskGroup.id);

    topTasks.forEach((t) => {
      // Create user-task-head
      const userTaskHead = {
        id: user_task_head.length + 1,
        user_id: userId,
        task_id: t.id, // `task_id` should be the `id` from `tasks`
        task_status: "Pending",
        process_rate: 0,
        start_date: null,
        create_date: new Date().toISOString(),
        last_updated_date: new Date().toISOString(),
      };

      user_task_head.push(userTaskHead);

      // Filter subtasks for the current task
      const relatedSubtasks = subtasks.filter((s) => s.task_id === t.id);

      relatedSubtasks.forEach((s) => {
        // Create user-task-detail
        const userTaskDetail = {
          id: user_task_detail.length + 1,
          head_id: userTaskHead.id,
          subtask_id: s.id,
          task_status: "Pending",
          document_id: s.document_id || null,
          doucment_upload_path: "",
          device_type_id: s.device_type_id || null,
          device_id: null,
          training_module_id: s.training_module_id || null,
          training_by: "",
          interview_id: s.interview_id || null,
          interview_by: "",
          survey_id: s.survey_id || null,
          start_date: null,
          create_date: new Date().toISOString(),
          last_updated_date: new Date().toISOString(),
        };

        user_task_detail.push(userTaskDetail);
      });
    });

    console.log("Onboarding tasks and details created:", {
      user_task_head,
      user_task_detail,
    });
  });

  // Add a new employee
  $("#employee-form").on("submit", function (e) {
    e.preventDefault();

    const newUser = {
      id: users.length + 1,
      username: `${$("#first-name").val()}_${$(
        "#last-name"
      ).val()}`.toLowerCase(),
      password: `${$("#first-name").val()}_${$(
        "#last-name"
      ).val()}`.toLowerCase(),
      role: "user",
      created_date: new Date().toISOString(),
      last_updated_date: new Date().toISOString(),
    };
    users.push(users);

    const newEmployee = {
      id: employees.length + 1,
      first_name: $("#first-name").val(),
      last_name: $("#last-name").val(),
      department_id: $("#department").val(),
      status: $("#status").val(),
      phone: $("#phone").val(),
      address: $("#address").val(),
      created_date: new Date().toISOString(),
      last_updated_date: new Date().toISOString(),
      user_id: newUser.id, // Example user ID, adjust as necessary
    };

    employees.push(newEmployee);
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
