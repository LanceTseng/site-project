import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import { formatDate } from "./utils/stringUtils.js";

// Fetch task by ID
async function fetchTaskById(taskId) {
  return await ParentTaskApi.getTaskById(taskId);
}

// Create a new task
async function createTask(taskData) {
  return await ParentTaskApi.createTask(taskData);
}

// Update an existing task
async function updateTask(taskId, taskData) {
  return await ParentTaskApi.updateTask(taskId, taskData);
}

// DOM Elements
// const taskTableBody = $("#taskTable tbody");
const taskGroupDropdown = $("#taskGroupId");
const taskModal = $("#taskModal");
const saveTaskButton = $("#saveTask");

async function populateDropdown(dropdownId, objectName) {
  try {
    const items = (await ObjectTypeApi.getTaskByName(objectName)) || [];

    // Add an empty option as the first item
    const options =
      `<option value="">-- Select --</option>` +
      items
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

// 🟢 Render Task List in Table
async function renderTasks() {
  const taskTableBody = $("#taskTableBody");
  taskTableBody.empty();

  try {
    const filterTaskGroup = $("#filterTaskGroup").val();
    const tasks = await ParentTaskApi.getParentTaskViewByCondition({
      task_group_id: filterTaskGroup,
    });

    tasks.forEach((task) => {
      const row = `
      <tr>
         <td>${task.task_id}</td>
        <td>${task.task_name}</td>
        <td>${task.task_description}</td>
        <td>${task.task_group}</td>
         <td>${task.enabled == 1 ? "Yes" : "No"}</td>
        <td>${formatDate(task.created_date)}</td>
          <td>${formatDate(task.last_updated_date)}</td>
        <td>
        <button class="btn btn-sm btn-info edit-task" data-id="${
          task.task_id
        }">Edit</button>
         <a href="/mgmt-subtask/${
           task.task_id
         }" class="btn btn-warning btn-sm">Add Subtask</a>
        </td>
      </tr>
      `;
      taskTableBody.append(row);
    });
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

// 🟢 Reset Modal Form
function resetTaskForm() {
  $("#taskName, #taskDescription").val("");
  taskGroupDropdown.val("");
}

// 🟢 Save Task (Create or Update)
async function saveTask() {
  const taskId = saveTaskButton.data("task-id");
  const taskData = {
    task_name: $("#taskName").val(),
    task_description: $("#taskDescription").val(),
    task_group_id: parseInt(taskGroupDropdown.val(), 10),
    enabled: $("#taskEnabled").val(),
  };

  if (!taskData.task_name || isNaN(taskData.task_group_id)) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    if (taskId) {
      await updateTask(taskId, taskData);
      Swal.fire("Success", "Task updated successfully!", "success");
    } else {
      await createTask(taskData);
      Swal.fire("Success", "Task added successfully!", "success");
    }

    await renderTasks();
    closeModal();
  } catch (error) {
    console.error("Error saving task:", error);
  }
}

// 🟢 Edit Task
async function editTask(taskId) {
  try {
    const task = await fetchTaskById(taskId);
    $("#taskName").val(task.task_name);
    $("#taskDescription").val(task.task_description);
    taskGroupDropdown.val(task.task_group_id);

    saveTaskButton.data("task-id", taskId); // Store task ID for updating
    taskModal.modal("show");
  } catch (error) {
    console.error("Error fetching task for editing:", error);
  }
}

// 🟢 Close Modal and Reset Form
function closeModal() {
  taskModal.modal("hide");
  $(".modal-backdrop").remove();
  $("body").removeClass("modal-open");
  saveTaskButton.removeData("task-id"); // Clear stored ID
  resetTaskForm();
}

// 🟢 Event Listeners
$(document).ready(() => {
  populateDropdown("#filterTaskGroup", "task_group");
  populateDropdown("#taskGroupId", "task_group");

  renderTasks();

  // Handle Save Task Click
  saveTaskButton.click(saveTask);

  // Event Delegation for Edit Button
  $("#taskTableBody").on("click", ".edit-task", function () {
    editTask($(this).data("id"));
  });

  $(".create-btn").click(function () {
    resetTaskForm();
    taskModal.modal("show");
  });

  // Handle Filter Task Group Change
  $("#filterTaskGroup").change(async () => {
    await renderTasks();
  });
});
