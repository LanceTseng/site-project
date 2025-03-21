import * as EmployeeApi from "./services/employeeServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ChildTaskApi from "./services/childTaskServices.js";
import * as ChildTaskViewApi from "./services/chilsTaskViewServices.js";
import * as UserApi from "./services/userServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import * as EmployeeViewApi from "./services/employeeViewService.js";
import { isEqualIgnoreCase } from "./utils/stringUtils.js";

$(document).ready(async function () {
  /** 🛠️ Utility Functions **/
  const handleError = (error, message) => console.error(message, error);

  const populateDropdown = async (dropdownId, taskName) => {
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
  };

  const loadEmployees = async () => {
    try {
      const employees = await EmployeeViewApi.getTasks();
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
        .join("");
      $("#employee-table-body").html(rows);
    } catch (error) {
      handleError(error, "Error loading employees");
    }
  };

  const startOnboardingProcess = async (userId) => {
    try {
      const taskGroup = (await ObjectTypeApi.getTaskByName("task_group")) || [];
      const onboardGroup = taskGroup.find(
        (o) => o.object_type_item_value.toLowerCase() === "onboard"
      );

      if (!onboardGroup) throw new Error("TaskGroup 'Onboard' not found.");

      const parentTasks = await ParentTaskApi.getTaskByGroupId(
        onboardGroup.object_type_item_key
      );
      if (!parentTasks.length) throw new Error("Parent tasks not found.");

      for (const parent of parentTasks) {
        const childTasks = await ChildTaskViewApi.getChildTaskByParentId(
          parent.task_id
        );

        console.log(childTasks);

        const countChildTasks =
          childTasks.filter((t) => Boolean(t.enabled))?.length || 0;

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
                training_module_id: child.training_module_id || null,   //link to training_module_dept_name
                access_provisioning_id: child.access_provisioning_id || null,
                interview_id: child.interview_id || null,
                survey_id: child.survey_id || null,
                hand_over_id: child.hand_over_id || null,
              })
            )
        );
      }

      const emp = await EmployeeApi.getTaskById(userId);
      emp.status = 1; // onboarding
      await EmployeeApi.updateTask(emp.employee_id, emp);

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

      setTimeout(() => {
        $("#onboarding-alert").hide();
      }, 3000);

      await loadEmployees();
    } catch (error) {
      handleError(error, "Error in onboarding process");
    }
  };

  await populateDropdown("#department, #edit-department", "department");
  await populateDropdown("#status, #edit-status", "employee_status");
  await loadEmployees();

  $("#employee-table-body").on(
    "click",
    ".start-onboarding-btn",
    async function () {
      const userId = $(this).data("id");
      await startOnboardingProcess(userId);
    }
  );

  $("#employee-form").on("submit", async function (e) {
    e.preventDefault();

    try {
      const firstName = $("#first-name").val();
      const lastName = $("#last-name").val();
      const department = $("#department").val();
      const username = `${firstName}_${lastName}`.toLowerCase();
      const onboard_date = $("#onboardDate").val();
      const phone = $("#phone").val();
      const address =  $("#address").val();

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
        phone: phone,
        address:address,
        onboard_date: onboard_date,
        is_active: true,
        link_user_id: newUser.user_id,
      });

      await loadEmployees();
      this.reset();
    } catch (error) {
      handleError(error, "Error adding employee");
    }
  });

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
