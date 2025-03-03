import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import { formatDate } from "./utils/stringUtils.js";

// Fetch all tasks
async function fetchTasks() {
  return await ParentTaskApi.getTasks();
}

// Fetch task by ID
async function fetchTaskById(taskId) {
  return await ParentTaskApi.getTaskById(taskId);
}

// Fetch task groups
async function fetchTaskGroups() {
  return await ObjectTypeApi.getTaskByName("task_group");
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
const taskTableBody = $("#taskTable tbody");
const taskGroupDropdown = $("#taskGroupId");
const taskModal = $("#taskModal");
const saveTaskButton = $("#saveTask");

// 🟢 Populate Task Groups Dropdown
async function populateTaskGroups() {
  taskGroupDropdown
    .empty()
    .append('<option value="" disabled selected>Select a Group</option>');

  try {
    const taskGroups = await fetchTaskGroups();
    taskGroups.forEach(({ object_type_item_key, object_type_item_value }) => {
      taskGroupDropdown.append(
        `<option value="${object_type_item_key}">${object_type_item_value}</option>`
      );
    });
  } catch (error) {
    console.error("Error loading task groups:", error);
  }
}

// 🟢 Render Task List in Table
async function renderTasks() {
  taskTableBody.empty();

  try {
    const [tasks, taskGroups] = await Promise.all([
      fetchTasks(),
      fetchTaskGroups(),
    ]);
    const taskGroupMap = new Map(
      taskGroups.map((g) => [g.object_type_item_key, g.object_type_item_value])
    );

    tasks.forEach(
      ({
        task_id,
        task_name,
        task_description,
        task_group_id,
        created_date,
        last_updated_date,
        enabled,
      }) => {
        taskTableBody.append(`
        <tr data-id="${task_id}">
          <td>${task_id}</td>
          <td>${task_name}</td>
          <td>${task_description}</td>
          <td>${taskGroupMap.get(task_group_id) || "Unknown Group"}</td>
          <td hidden>${task_group_id}</td>
          <td>${enabled == 1 ? "Yes" : "No"}</td>
          <td>${formatDate(created_date)}</td>
          <td>${formatDate(last_updated_date)}</td>
          <td>
            <button class="btn btn-info btn-sm edit-task" data-id="${task_id}">Edit</button>
            <a href="/mgmt-subtask/${task_id}" class="btn btn-primary btn-sm">Add Subtask</a>
          </td>
        </tr>
      `);
      }
    );
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
  populateTaskGroups();
  renderTasks();

  // Handle Save Task Click
  saveTaskButton.click(saveTask);

  // Event Delegation for Edit Button
  $(document).on("click", ".edit-task", function () {
    editTask($(this).data("id"));
  });
});
