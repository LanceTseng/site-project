import * as UserTaskViewApi from "./services/userTaskViewServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";

import { isEqualIgnoreCase } from "./utils/stringUtils.js";
// Wait for the DOM to be fully loaded before processing
$(document).ready(async function () {
  // Initially display all tasks when the page is rendered
  await displayUserTaskHeader();

  // Attach click event using event delegation to handle clicks on dynamically generated rows
  $("#userTaskHeaderList").on("click", ".task-row", function () {
    const taskHeadId = $(this).data("task-head-id"); // Corrected data attribute
    displayUserTaskDetail(taskHeadId);
  });
});

async function displayUserTaskHeader() {
  try {
    // Fetch user parent tasks
    const userParentTasks = await UserTaskViewApi.getAllUserParentTasks();

    // Map each task to an HTML row
    const taskRows = await Promise.all(
      userParentTasks.map(async (task) => {
        // Get child tasks related to this parent task
        const childTasks = await UserTaskViewApi.getUserChildTaskByTaskId(
          task.head_id
        );

        // Calculate process rate
        const completeChildTasks = childTasks.filter(
          (c) => c.ct_status === 2
        ).length;
        const processRate =
          task.count_child_tasks > 0
            ? (completeChildTasks / task.count_child_tasks) * 100
            : 0;
        return `
          <tr class="task-row" data-task-head-id="${task.head_id}">
            <td>${task.user_name}</td>
            <td>${task.pt_name}</td>
            <td>${task.pt_desc}</td>
            <td>${task.pt_status_name}</td>
            <td>${processRate.toFixed(2)}%</td>
            <td>${new Date(task.start_date).toLocaleDateString()}</td>
            <td>${new Date(task.end_date).toLocaleDateString()}</td>
             <td>${new Date(task.last_updated_date).toLocaleDateString()}</td>
            <td>
              ${
                isEqualIgnoreCase(task.pt_status_name, "Pending")
                  ? `<button class="btn btn-primary btn-sm start-parent-task" data-id="${task.head_id}">Start</button>`
                  : isEqualIgnoreCase(task.pt_status_name, "Processing")
                  ? `<button class="btn btn-success btn-sm complete-parent-task" data-id="${task.head_id}">Complete</button>`
                  : "N/A"
              }
            </td> 
          </tr>
        `;
      })
    );

    // Insert rows into the table
    $("#userTaskHeaderList").html(taskRows.join(""));
  } catch (error) {
    console.error("Error displaying user tasks:", error);
  }
}

//start process by parent task
$("#userTaskHeaderList").on("click", ".start-parent-task", async function () {
  const user_task_head_id = $(this).data("id");
  try {
    // Fetch parent task details
    const head_task = await UserTaskViewApi.getUserTaskById(user_task_head_id);

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Start All Subtasks?",
      text: `Are you sure you want to start all subtasks under [${head_task.pt_name}]?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // Fetch and process child tasks
      const childTasks = await UserTaskViewApi.getUserChildTaskByTaskId(
        user_task_head_id
      );

      for (const task of childTasks) {
        const user_child_task = await UserChildTaskApi.getTaskById(
          task.line_id
        );
        user_child_task.status = 1; //Processings
        user_child_task.start_date = new Date();

        await UserChildTaskApi.updateTask(task.line_id, user_child_task);
      }

      const user_parent_task = await UserParentTaskApi.getTaskById(
        user_task_head_id
      );
      user_parent_task.status = 1;
      user_parent_task.start_date = new Date();
      console.log(user_parent_task);

      await UserParentTaskApi.updateTask(user_task_head_id, user_parent_task);

      displayUserTaskHeader();

      displayUserTaskDetail(user_task_head_id);

      Swal.fire("Started!", "All subtasks have been started.", "success");
    } else {
      Swal.fire("Cancelled", "Only the parent task remains unchanged.", "info");
    }
  } catch (error) {
    console.error("Error processing tasks:", error);
    Swal.fire("Error", "Something went wrong. Please try again.", "error");
  }
});

// Function to display user task details when a task is clicked
async function displayUserTaskDetail(taskHeadId) {
  try {
    // Fetch task details for the selected head ID
    const taskDetails = await UserTaskViewApi.getUserChildTaskByTaskId(
      taskHeadId
    );

    if (!taskDetails || taskDetails.length === 0) {
      $("#userTaskDetailList").html(
        "<tr><td colspan='10'>No details available</td></tr>"
      );
      return;
    }

    // Map each detail row to an HTML element
    const taskDetailRows = taskDetails
      .map(
        (detail) => `
          <tr>
            <td>${detail.ct_task_name || "N/A"}</td>
            <td>${detail.ct_desc || "N/A"}</td>
            <td>${detail.ct_status_name || "N/A"}</td>
            <td>${
              detail.document_id
                ? `<a href="${detail.document_path}" target="_blank">View Document</a>`
                : "N/A"
            }</td>
            <td>${detail.eqpt_name || "N/A"}</td>
            <td>${detail.trainning_module_id || "N/A"}</td>
            <td>${detail.interview_id || "N/A"}</td>
            <td>${detail.survey_id || "N/A"}</td>
            <td>${
              detail.ct_start_date
                ? new Date(detail.ct_start_date).toLocaleDateString()
                : ""
            }</td>
            <td>${
              detail.ct_end_date
                ? new Date(detail.ct_end_date).toLocaleDateString()
                : ""
            }</td>
             <td>${
               detail.last_updated_date
                 ? new Date(detail.last_updated_date).toLocaleDateString()
                 : new Date(detail.created_date).toLocaleDateString()
             }</td>
           <td>
              ${
                isEqualIgnoreCase(detail.ct_status_name, "Pending")
                  ? `<button class="btn btn-primary btn-sm start-current-task" data-id="${detail.line_id}">Start</button>`
                  : isEqualIgnoreCase(detail.ct_status_name, "Processing")
                  ? `<button class="btn btn-success btn-sm complete-current-task" data-id="${detail.line_id}">Complete</button>`
                  : "N/A"
              }
            </td> 
          </tr>
        `
      )
      .join("");

    $("#userTaskDetailList").html(taskDetailRows);
  } catch (error) {
    console.error(
      `Error fetching task details for head ID ${taskHeadId}:`,
      error
    );
  }
}
