import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskApi from "./services/childTaskServices.js";
import * as ChildTaskViewApi from "./services/chilsTaskViewServices.js";
import * as UserApi from "./services/userServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import * as EmployeeViewApi from "./services/employeeViewService.js";
import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

let employees;

async function loadEmployee() {
  const response = await UserEmployeeViewApi.getAllUserEmployees();
  employees = response.filter((x) => [2, 3].includes(x.status));

  const employeeTableBody = $("#employeeTableBody");
  employeeTableBody.empty();

  const statusClasses = {
    onboarding: "bg-success text-white",
    pending: "bg-info text-white",
    offboarding: "bg-danger text-white",
  };

  employees.forEach((employee) => {
    const badgeClass =
      statusClasses[employee.status_name.toLowerCase()] ||
      "bg-secondary text-white"; // Default class

    const isNormal = employee.status_name.toLowerCase() === "normal";
    const btnOffboarding = isNormal
      ? `<button class="btn btn-danger btn-sm btn-offboarding" data-id="${employee.user_id}" data-name="${employee.username}">Start Offboard</button>`
      : "N/A";

    const row = $(`
      <tr>
        <td>${employee.user_id}</td>
        <td>${employee.first_name}</td>
        <td>${employee.last_name}</td>
        <td><span class="badge ${badgeClass}">${employee.status_name}</span></td>
        <td>${employee.department_name}</td>
        <td>${btnOffboarding}</td>
      </tr>
    `);

    employeeTableBody.append(row);
  });
}

async function handleOffboardingProcess(userId) {
  try {
    const taskGroup = (await ObjectTypeApi.getTaskByName("task_group")) || [];
    const onboardGroup = taskGroup.find(
      (o) => o.object_type_item_value.toLowerCase() === "offboard"
    );
    if (!onboardGroup) throw new Error("TaskGroup 'offboard' not found.");

    const parentTasks = await ParentTaskApi.getTaskByGroupId(
      onboardGroup.object_type_item_key
    );

    if (!parentTasks.length) throw new Error("Parent tasks not found.");

    await Promise.all(
      parentTasks.map(async (parent) => {
        const childTasks = await ChildTaskViewApi.getChildTaskByParentId(
          parent.task_id
        );
        const countChildTasks = childTasks.filter((t) => t.enabled).length;

        const userParentTask = await UserParentTaskApi.createTask({
          user_id: userId,
          parent_task_id: parent.task_id,
          status: 0,
          count_child_tasks: countChildTasks,
        });

        await Promise.all(
          childTasks
            .filter((t) => Boolean(t.enabled))
            .map((child) =>
              UserChildTaskApi.createTask({
                user_parenttask_id: userParentTask.id,
                child_task_id: child.child_task_id,
                status: 0,
                document_id: child.document_id || null,
                document_path: "",
                require_upload: child.require_upload || 0,
                equipment_type_id: child.equipment_type_id || null,
                training_module_id: child.training_module_id || null,
                access_provisioning_id: child.access_provisioning_id || null,
                interview_id: child.interview_id || null,
                survey_id: child.survey_id || null,
                hand_over_id: child.hand_over_id || null,
              })
            )
        );
      })
    );

    const emp = await EmployeeApi.getTaskById(userId);
    emp.status = 2; //offboarding
    emp.offboard_date = $("#offboardDate").val();
    await EmployeeApi.updateTask(emp.employee_id, emp);

    Swal.fire(
      "Success",
      `[${emp.first_name} ${emp.last_name}] start offboarding!`,
      "success"
    );

    $("#offboardModal").modal("hide");
    loadEmployee();
  } catch (error) {
    console.error(error.message);
  }
}

function filterEmployee() {
  const employeeTableBody = $("#employeeTableBody");
  employeeTableBody.empty();

  const statusClasses = {
    onboarding: "bg-success text-white",
    pending: "bg-info text-white",
    offboarding: "bg-danger text-white",
  };

  let searchName = $("#searchInput").val().toLowerCase(); // Convert search term to lowercase

  employees
    .filter(
      (employee) =>
        employee.first_name.toLowerCase().includes(searchName) || // Check first name
        employee.last_name.toLowerCase().includes(searchName) // Check last name
    )
    .forEach((employee) => {
      const badgeClass =
        statusClasses[employee.status_name.toLowerCase()] ||
        "bg-secondary text-white"; // Default class

      const isNormal = employee.status_name.toLowerCase() === "normal";
      const btnOffboarding = isNormal
        ? `<button class="btn btn-danger btn-sm btn-offboarding" data-id="${employee.user_id}" data-name="${employee.username}">Start Offboard</button>`
        : "N/A";

      const row = $(`
        <tr>
          <td>${employee.user_id}</td>
          <td>${employee.first_name}</td>
          <td>${employee.last_name}</td>
          <td><span class="badge ${badgeClass}">${employee.status_name}</span></td>
          <td>${employee.department_name}</td>
          <td>${btnOffboarding}</td>
        </tr>
      `);

      employeeTableBody.append(row);
    });
}

$(document).ready(function () {
  // Function to populate employee dropdown with name and department
  loadEmployee();

  $(document).on("click", ".btn-offboarding", function (e) {
    e.preventDefault();
    // Get data attributes from the clicked button
    const employeeName = $(this).data("name");
    const userId = $(this).data("id");

    $("#employeeName").text(employeeName);
    $("#employeeId").val(userId);

    let today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    $("#offboardDate").val(today);

    $("#offboardModal").modal("show");
  });

  $("#confirmOffboard").click((e) => {
    e.preventDefault();
    const userId = $("#employeeId").val();
    handleOffboardingProcess(userId);
  });

  $("#searchInput").on("change", () => {
    filterEmployee();
  });
});
