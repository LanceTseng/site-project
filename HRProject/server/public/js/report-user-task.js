import * as UserTaskViewApi from "./services/userTaskViewServices.js";
import * as UserParentTaskApi from "./services/relUserParentTaskServices.js";
import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import * as DocumentApi from "./services/documentServices.js";
import * as TrainingModuleApi from "./services/trainingModuleServices.js";
import * as userTrainingServices from "./services/userTrainingServices.js";
import * as FileApi from "./services/fileServices.js";

import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

let loginUser;

$(document).ready(async function () {
  loginUser = JSON.parse(sessionStorage.getItem("user"));

  await displayUserTaskHeader();

  $("#userTaskHeaderList").on("click", ".task-row", function () {
    displayUserTaskDetail($(this).data("task-head-id"));
  });

  $("#userTaskHeaderList").on("click", ".start-parent-task", function () {
    handleParentTaskStart($(this).data("id"));
  });

  $("#userTaskDetailList").on("click", ".start-child-task", function () {
    handleChildTaskStart($(this).data("id"), $(this).data("headid"));
  });

  $("#userTaskHeaderList").on("click", ".complete-parent-task", function () {
    handleParentTaskComplete($(this).data("id"));
  });

  $("#userTaskDetailList").on("click", ".complete-child-task", function () {
    handleChildTaskComplete($(this).data("id"), $(this).data("headid"));
  });

  $("#userTaskDetailList").on("click", ".upload-file-btn", function () {
    handleChildTaskFileUpload($(this).data("id"));
  });
});

async function displayUserTaskHeader() {
  try {
    let userParentTasks = [];
    if (isEqualIgnoreCase(loginUser.user_role, "hr")) {
      userParentTasks = await UserTaskViewApi.getAllUserParentTasks();
    } else {
      userParentTasks = await UserTaskViewApi.getUserParentTaskByUserId(
        loginUser.user_id
      );
    }
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

  const statusButton = getStatusButton(
    task.pt_status_name,
    task.head_id,
    "parent"
  );

  if (childTasks.length === 0) {
    return `
    <tr class="task-row" data-task-head-id="${task.head_id}">
      <td>${task.user_name}</td>
      <td>${task.pt_name}</td>
      <td>${task.pt_desc}</td>
    <td>${task.task_group_name}</td>
      <td>${task.pt_status_name}</td>
      <td>${
        isEqualIgnoreCase(task.pt_status_name, "completed") ? 100.0 : 0.0
      }%</td>
      <td>${formatDate(task.pt_start_date)}</td>
      <td>${formatDate(task.pt_end_date)}</td>
      <td>${formatDate(task.last_updated_date) || task.created_date}</td>
      <td>${statusButton}</td>
    </tr>
  `;
  }

  const completeChildTasks =
    childTasks.filter((c) => c.ct_status === 2).length ?? 0;
  const processRate =
    task.count_child_tasks > 0
      ? (completeChildTasks / task.count_child_tasks) * 100
      : 0;

  return `
    <tr class="task-row" data-task-head-id="${task.head_id}">
      <td>${task.user_name}</td>
      <td>${task.pt_name}</td>
      <td>${task.pt_desc}</td>
      <td>${task.task_group_name}</td>
      <td>${task.pt_status_name}</td>
      <td>${processRate.toFixed(2)}%</td>
      <td>${formatDate(task.pt_start_date)}</td>
      <td>${formatDate(task.pt_end_date)}</td>
      <td>${formatDate(task.last_updated_date) || task.created_date}</td>
      <td>${statusButton}</td>
    </tr>
  `;
}

function getStatusButton(status, taskId, type, headId = null) {
  if (isEqualIgnoreCase(status, "Pending")) {
    return isEqualIgnoreCase(type, "parent")
      ? `<button class="btn btn-primary btn-sm start-${type}-task" data-id="${taskId}">Start</button>`
      : `<button class="btn btn-primary btn-sm start-${type}-task" data-id="${taskId}" data-headid="${headId}">Start</button>`;
  }
  if (isEqualIgnoreCase(status, "Processing")) {
    return isEqualIgnoreCase(type, "parent")
      ? `<button class="btn btn-success btn-sm complete-${type}-task" data-id="${taskId}">Complete</button>`
      : `<button class="btn btn-success btn-sm complete-${type}-task" data-id="${taskId}" data-headid="${headId}">Complete</button>`;
  }
  return "N/A";
}

async function handleParentTaskStart(user_task_head_id) {
  try {
    const head_task = await UserTaskViewApi.getUserTaskByHeadId(
      user_task_head_id
    );
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
      await startBatchChildTasks(user_task_head_id);
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

async function handleParentTaskComplete(user_task_head_id) {
  try {
    const head_task = await UserTaskViewApi.getUserTaskByHeadId(
      user_task_head_id
    );
    const result = await Swal.fire({
      title: "Complete All Subtasks?",
      text: `Are you sure you want to complete all subtasks under [${head_task.pt_name}]?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await completeBatchChildTasks(user_task_head_id);
      await completeParentTask(user_task_head_id);
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

async function handleChildTaskComplete(user_task_line_id, user_task_head_id) {
  try {
    const child_task = await UserTaskViewApi.getUserTaskByLineId(
      user_task_line_id
    );

    const result = await Swal.fire({
      title: "Start Subtasks?",
      text: `Are you sure you want to start the subtasks [${child_task.ct_name}]?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await completeSingleChildTask(user_task_line_id);

      const child_tasks =
        (await UserTaskViewApi.getUserTaskByHeadId(user_task_head_id)) ?? [];

      const uncompleted_child_tasks = Array.isArray(child_tasks)
        ? child_tasks.filter((o) => o?.ct_status < 2).length
        : 0;

      if (uncompleted_child_tasks === 0) {
        await completeParentTask(user_task_head_id);
      }

      await Promise.all([
        displayUserTaskHeader(),
        displayUserTaskDetail(user_task_head_id),
      ]);

      await Swal.fire("Started!", "The subtasks have been started.", "success");
    } else {
      await Swal.fire(
        "Cancelled",
        "Only the parent task remains unchanged.",
        "info"
      );
    }
  } catch (error) {
    console.error("Error processing tasks:", error);
    await Swal.fire(
      "Error",
      "Something went wrong. Please try again.",
      "error"
    );
  }
}

async function handleChildTaskStart(user_task_line_id, user_task_head_id) {
  try {
    const child_task = await UserTaskViewApi.getUserTaskByLineId(
      user_task_line_id
    );

    const result = await Swal.fire({
      title: "Start Subtasks?",
      text: `Are you sure you want to start the subtasks [${child_task.ct_name}]?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Start",
      cancelButtonText: "No, Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await startSingleChildTask(user_task_line_id);
      await startParentTask(user_task_head_id);
      await displayUserTaskHeader();
      await displayUserTaskDetail(user_task_head_id);
      Swal.fire("Started!", "The subtasks have been started.", "success");
    } else {
      Swal.fire("Cancelled", "Only the parent task remains unchanged.", "info");
    }
  } catch (error) {
    console.error("Error processing tasks:", error);
    Swal.fire("Error", "Something went wrong. Please try again.", "error");
  }
}

async function handleChildTaskFileUpload(user_task_line_id) {
  try {
    const user_child_task = await UserChildTaskApi.getTaskById(
      user_task_line_id
    );

    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "*/*";

    fileInput.addEventListener("change", async function () {
      if (!fileInput.files.length) return;

      const selectedFile = fileInput.files[0];

      try {
        // Upload file using Axios
        const response = await FileApi.uploadFile(selectedFile);

        //update to child task document
        const file = await FileApi.getFileUrl(response.filename);

        user_child_task.document_path = file.fileurl;
        await UserChildTaskApi.updateTask(user_task_line_id, user_child_task);

        fileInput.value = ""; // Reset input after upload

        Swal.fire("Started!", "File upload successfully.", "success");

        await displayUserTaskHeader();
        await displayUserTaskDetail(user_child_task.user_parenttask_id);
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        await Swal.fire("Error", "File upload failed.", "error");
      }
    });

    // Trigger file selection
    fileInput.click();
  } catch (error) {
    console.error("Error processing tasks:", error);
    await Swal.fire(
      "Error",
      "Something went wrong. Please try again.",
      "error"
    );
  }
}

async function startBatchChildTasks(taskHeadId) {
  const childTasks = await UserTaskViewApi.getUserChildTaskByTaskId(taskHeadId);
  for (const task of childTasks) {
    const updatedTask = await UserChildTaskApi.getTaskById(task.line_id);
    updatedTask.status = 1;
    updatedTask.start_date = new Date();
    await UserChildTaskApi.updateTask(task.line_id, updatedTask);
  }
}

async function completeBatchChildTasks(taskHeadId) {
  const childTasks = await UserTaskViewApi.getUserChildTaskByTaskId(taskHeadId);
  for (const task of childTasks) {
    const updatedTask = await UserChildTaskApi.getTaskById(task.line_id);
    updatedTask.status = 2;
    updatedTask.end_date = new Date();
    await UserChildTaskApi.updateTask(task.line_id, updatedTask);
  }
}

async function startSingleChildTask(taskLineId) {
  const updatedTask = await UserChildTaskApi.getTaskById(taskLineId);
  updatedTask.status = 1;
  updatedTask.start_date = new Date();
  await UserChildTaskApi.updateTask(taskLineId, updatedTask);
}

async function completeSingleChildTask(taskLineId) {
  const updatedTask = await UserChildTaskApi.getTaskById(taskLineId);
  updatedTask.status = 2;
  updatedTask.start_date = new Date();
  await UserChildTaskApi.updateTask(taskLineId, updatedTask);
}

async function startParentTask(taskHeadId) {
  const parentTask = await UserParentTaskApi.getTaskById(taskHeadId);
  if (!isEqualIgnoreCase(parentTask.pt_status_name, "processing")) {
    parentTask.status = 1;
    parentTask.start_date = new Date();
    await UserParentTaskApi.updateTask(taskHeadId, parentTask);
  }
}

async function completeParentTask(taskHeadId) {
  const parentTask = await UserParentTaskApi.getTaskById(taskHeadId);
  if (!isEqualIgnoreCase(parentTask.pt_status_name, "processing")) {
    parentTask.status = 2;
    parentTask.end_date = new Date();
    await UserParentTaskApi.updateTask(taskHeadId, parentTask);
  }
}

async function displayUserTaskDetail(taskHeadId) {
  try {
    const taskDetails = await UserTaskViewApi.getUserChildTaskByTaskId(
      taskHeadId
    );

    const taskDetailRows = taskDetails.length
      ? taskDetails.map(buildTaskDetailRow).join("")
      : "<tr><td colspan='13'>No details available</td></tr>";
    $("#userTaskDetailList").html(taskDetailRows);
  } catch (error) {
    console.error(
      `Error fetching task details for head ID ${taskHeadId}:`,
      error
    );
  }
}

async function getOfficalDocumentFile(documentId) {
  try {
    const response = await DocumentApi.getTaskById(documentId);

    if (!response || !response.document_path) return "";

    const fileResponse = await FileApi.getOfficalFileUrl(
      response.document_path
    );

    return fileResponse?.fileurl || "";
  } catch (error) {
    console.error("Error fetching official document file:", error);
    return "";
  }
}

function updateDocumentLink(documentId, documentCellId, documentName) {
  if (!documentId) return;

  getOfficalDocumentFile(documentId)
    .then((officialUrl) => {
      setTimeout(() => {
        const documentCell = $(`#${documentCellId}`);
        if (documentCell.length > 0) {
          documentCell.html(
            officialUrl && typeof officialUrl === "string"
              ? `<a href="${officialUrl}" target="_blank">${documentName}</a>`
              : documentName
          );
        }
      }, 100);
    })
    .catch((error) => {
      console.error("Error updating document link:", error);
    });
}
//complete require check function => depend on maintain

function buildTaskDetailRow(detail) {
  const fileUrl = detail.document_path || "";
  const filename = fileUrl
    ? fileUrl.substring(fileUrl.lastIndexOf("/") + 1)
    : "";

  const rowId = `task-row-${detail.line_id}`;
  const documentCellId = `document-link-${detail.line_id}`;

  const uploadButton =
    detail.require_upload &&
    isEqualIgnoreCase(detail.ct_status_name, "processing")
      ? `<button class="btn btn-secondary upload-file-btn" data-id="${detail.line_id}">Upload File</button>`
      : "";

  const fileLink = fileUrl
    ? `<a href="${fileUrl}" target="_blank">${filename}</a>`
    : "No file";

  const surveyLink = detail.survey_id
    ? isEqualIgnoreCase(detail.ct_status_name, "processing")
      ? `<a href="/form/${detail.survey_id}/lineid/${detail.line_id}" target="_self">${detail.survey_name}</a>`
      : isEqualIgnoreCase(detail.ct_status_name, "completed")
      ? `<a href="/form-review/${detail.line_id}" target="_self">${detail.survey_name}(Review)</a>`
      : `${detail.survey_name}`
    : "";

  const handoverLink = detail.hand_over_id
    ? isEqualIgnoreCase(detail.ct_status_name, "processing")
      ? `<a href="/form-handover/lineid/${detail.line_id}" target="_self">Hand Over Form</a>`
      : isEqualIgnoreCase(detail.ct_status_name, "completed")
      ? `<a href="/form-handover/review/${detail.line_id}" target="_self">Hand Over Form(Review)</a>`
      : `Handover Required`
    : "";

  // buildUserTrainingModule(detail.line_id, detail.training_department_id);
  const TrainingLink = detail.training_module_id
  ? isEqualIgnoreCase(detail.ct_status_name, "processing")
    ? `<a href="/report-training/lineid/${detail.line_id}/trainingdeptid/${detail.training_module_id}/userid/${detail.user_id}" target="_self">${detail.training_module_dept_name}</a>`
    : isEqualIgnoreCase(detail.ct_status_name, "completed")
    ? `<a href="/report-training" target="_self">${detail.training_module_dept_name}(Report)</a>`
    : `${detail.training_module_dept_name}`
  : "";

  const rowHtml = `
    <tr id="${rowId}">
      <td>${detail.line_id || ""}</td>
      <td>${detail.ct_task_name || ""}</td>
      <td>${detail.ct_desc || ""}</td>
      <td>${detail.ct_status_name || ""}</td>
      <td id="${documentCellId}"></td>
      <td>${uploadButton} ${fileLink}</td>  
      <td>${detail.eqpt_type_name || ""}</td>
      <td>${
        detail.equipment_id ? `${detail.eqpt_name} (${detail.eqpt_code})` : ""
      }</td>
      <td>${TrainingLink}</td>
      <td>${handoverLink}</td>
      <td>${surveyLink}</td>
      <td>${formatDate(detail.ct_start_date)}</td>
      <td>${formatDate(detail.ct_end_date)}</td>
      <td>${formatDate(detail.last_updated_date || detail.created_date)}</td>
      <td>${getStatusButton(
        detail.ct_status_name,
        detail.line_id,
        "child",
        detail.user_parenttask_id
      )}</td>
    </tr>
  `;

  // Update document link if document_id exists
  if (detail.document_id) {
    updateDocumentLink(
      detail.document_id,
      documentCellId,
      detail.document_name
    );
  }

  return rowHtml;
}
