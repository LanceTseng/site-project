import * as UserTaskViewApi from "./services/userTaskViewServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import { isEqualIgnoreCase } from "./utils/stringUtils.js";

$(document).ready(async function () {
  await displayUserTaskHeader();

  $("#userTaskHeaderList").on("click", ".task-row", function () {
    displayUserTaskDetail($(this).data("task-head-id"));
  });

  $("#userTaskHeaderList").on("click", ".start-parent-task", function () {
    handleParentTaskStart($(this).data("id"));
  });
});

async function displayUserTaskHeader() {
  try {
    const userParentTasks = await UserTaskViewApi.getAllUserParentTasks();
    const taskRows = await Promise.all(userParentTasks.map(buildTaskRow));
    $("#userTaskHeaderList").html(taskRows.join(""));
  } catch (error) {
    console.error("Error displaying user tasks:", error);
  }
}

async function buildTaskRow(task) {
  const childTasks = await UserTaskViewApi.getUserChildTaskByTaskId(
    task.head_id
  );
  const completeChildTasks = childTasks.filter((c) => c.ct_status === 2).length;
  const processRate =
    task.count_child_tasks > 0
      ? (completeChildTasks / task.count_child_tasks) * 100
      : 0;
  const statusButton = getStatusButton(task.pt_status_name, task.head_id);

  return `
    <tr class="task-row" data-task-head-id="${task.head_id}">
      <td>${task.user_name}</td>
      <td>${task.pt_name}</td>
      <td>${task.pt_desc}</td>
      <td>${task.pt_status_name}</td>
      <td>${processRate.toFixed(2)}%</td>
      <td>${formatDate(task.pt_start_date)}</td>
      <td>${formatDate(task.pt_end_date)}</td>
      <td>${formatDate(task.last_updated_date) || task.created_date}</td>
      <td>${statusButton}</td>
    </tr>
  `;
}

function getStatusButton(status, taskId) {
  if (isEqualIgnoreCase(status, "Pending")) {
    return `<button class="btn btn-primary btn-sm start-parent-task" data-id="${taskId}">Start</button>`;
  }
  if (isEqualIgnoreCase(status, "Processing")) {
    return `<button class="btn btn-success btn-sm complete-parent-task" data-id="${taskId}">Complete</button>`;
  }
  return "N/A";
}

async function handleParentTaskStart(user_task_head_id) {
  try {
    const head_task = await UserTaskViewApi.getUserTaskById(user_task_head_id);
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
      await startChildTasks(user_task_head_id);
      await startParentTask(user_task_head_id);
      await displayUserTaskHeader();
      await displayUserTaskDetail(user_task_head_id);
      Swal.fire("Started!", "All subtasks have been started.", "success");
    } else {
      Swal.fire("Cancelled", "Only the parent task remains unchanged.", "info");
    }
  } catch (error) {
    console.error("Error processing tasks:", error);
    Swal.fire("Error", "Something went wrong. Please try again.", "error");
  }
}

async function startChildTasks(taskHeadId) {
  const childTasks = await UserTaskViewApi.getUserChildTaskByTaskId(taskHeadId);
  for (const task of childTasks) {
    const updatedTask = await UserChildTaskApi.getTaskById(task.line_id);
    updatedTask.status = 1;
    updatedTask.start_date = new Date();
    await UserChildTaskApi.updateTask(task.line_id, updatedTask);
  }
}

async function startParentTask(taskHeadId) {
  const parentTask = await UserParentTaskApi.getTaskById(taskHeadId);
  parentTask.status = 1;
  parentTask.start_date = new Date();
  await UserParentTaskApi.updateTask(taskHeadId, parentTask);
}

async function displayUserTaskDetail(taskHeadId) {
  try {
    const taskDetails = await UserTaskViewApi.getUserChildTaskByTaskId(
      taskHeadId
    );
    const taskDetailRows = taskDetails.length
      ? taskDetails.map(buildTaskDetailRow).join("")
      : "<tr><td colspan='10'>No details available</td></tr>";
    $("#userTaskDetailList").html(taskDetailRows);
  } catch (error) {
    console.error(
      `Error fetching task details for head ID ${taskHeadId}:`,
      error
    );
  }
}

function buildTaskDetailRow(detail) {
  return `
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
      <td>${formatDate(detail.ct_start_date)}</td>
      <td>${formatDate(detail.ct_end_date)}</td>
      <td>${formatDate(detail.last_updated_date || detail.created_date)}</td>
      <td>${getStatusButton(detail.ct_status_name, detail.line_id)}</td>
    </tr>
  `;
}

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : "";
}
