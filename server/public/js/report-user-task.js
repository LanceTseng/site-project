import * as UserTaskViewApi from "./services/userTaskViewServices.js";
import { isEqualIgnoreCase } from "./utils/stringUtils.js";
// Wait for the DOM to be fully loaded before processing
$(document).ready(async function () {
  // Initially display all tasks when the page is rendered
  await displayUserTaskHeader();

  // Attach click event using event delegation to handle clicks on dynamically generated rows
  $("#userTaskHeaderList").on("click", ".task-row", function () {
    const taskHeadId = $(this).data("task-head-id"); // Corrected data attribute
    console.log("Clicked Task Head ID:", taskHeadId); // Log the taskHeadId
    displayUserTaskDetail(taskHeadId);
  });
});

async function displayUserTaskHeader() {
  try {
    // Fetch user parent tasks
    const userParentTasks = await UserTaskViewApi.getAllUserTasks();

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
            <td>${task.p_status_name}</td>
            <td>${processRate.toFixed(2)}%</td>
            <td>${new Date(task.start_date).toLocaleDateString()}</td>
            <td>${new Date(task.end_date).toLocaleDateString()}</td>
             <td>${new Date(task.last_updated_date).toLocaleDateString()}</td>
            <td>
              ${
                isEqualIgnoreCase(task.p_status_name, "Pending")
                  ? `<button class="btn btn-primary btn-sm start-task">Start</button>`
                  : isEqualIgnoreCase(task.p_status_name, "Processing")
                  ? `<button class="btn btn-success btn-sm complete-task">Complete</button>`
                  : ""
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
            <td>${new Date(detail.ct_start_date).toLocaleDateString()}</td>
            <td>${new Date(detail.ct_end_date).toLocaleDateString()}</td>
            <td>
              ${
                detail.ct_status === "Pending"
                  ? `<button class="btn btn-primary btn-sm start-task">Start</button>`
                  : detail.ct_status === "Processing"
                  ? `<button class="btn btn-success btn-sm complete-task">Complete</button>`
                  : ""
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
