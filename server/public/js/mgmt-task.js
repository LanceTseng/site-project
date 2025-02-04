// Import mock data
import { tasks, object_type } from "./mockdata.js"; // Adjust the path as necessary

// Populate task group dropdown
function populateTaskGroups() {
  const taskGroupDropdown = $("#taskGroupId");
  taskGroupDropdown.empty();
  taskGroupDropdown.append('<option value="" disabled selected>Select a Group</option>');

  object_type
    .filter((g) => g.object === "TaskGroup")
    .forEach((group) => {
      taskGroupDropdown.append(`<option value="${group.id}">${group.object_type}</option>`);
    });
}

// Render tasks
function renderTasks() {
  const taskTableBody = $("#taskTable tbody");
  taskTableBody.empty(); // Clear existing rows

  tasks.forEach((task) => {
    const taskGroup = object_type.find(
      (g) => g.object === "TaskGroup" && g.id === task.task_group_id
    );

    const taskGroupName = taskGroup ? taskGroup.object_type : "N/A";

    const row = `
      <tr data-id="${task.id}">
        <td>${task.id}</td>
        <td>${task.task_name}</td>
        <td>${task.task_description}</td>
        <td>${taskGroupName}</td>
        <td>${task.auto_start ? "Yes" : "No"}</td>
        <td>${task.created_date}</td>
        <td>${task.last_updated_date}</td>
        <td>
          <button class="btn btn-info btn-sm edit-task">Edit</button>
          <a href="/mgmt-subtask/${task.id}" class="btn btn-primary btn-sm">Add Subtask</a>
        </td>
      </tr>
    `;
    taskTableBody.append(row);
  });
}

// Reset modal form
function resetTaskForm() {
  $("#taskName").val("");
  $("#taskDescription").val("");
  $("#taskGroupId").val("");
  $("#autoStart").val("false");
}

// Create new task
$("#saveTask").click(function () {
  const taskName = $("#taskName").val();
  const taskDescription = $("#taskDescription").val();
  const taskGroupId = $("#taskGroupId").val();
  const autoStart = $("#autoStart").val() === "true";

  // Add task to the mock data
  const newTask = {
    id: tasks.length + 1, // Generate a new ID
    task_name: taskName,
    task_description: taskDescription,
    task_group_id: parseInt(taskGroupId),
    auto_start: autoStart,
    created_date: new Date().toISOString(),
    last_updated_date: new Date().toISOString(),
    subtasks: [], // Empty array for subtasks
  };

  tasks.push(newTask); // Add new task to the array
  renderTasks(); // Re-render the tasks list
  closeModal();
  resetTaskForm(); // Reset form
  
});

// Edit task
$(document).on("click", ".edit-task", function () {
  const taskId = $(this).closest("tr").data("id");
  const task = tasks.find((t) => t.id === taskId);

  // Populate the modal with the task data
  $("#taskName").val(task.task_name);
  $("#taskDescription").val(task.task_description);
  $("#taskGroupId").val(task.task_group_id);
  $("#autoStart").val(task.auto_start ? "true" : "false");

  // Update task on save
  $("#saveTask")
    .off("click")
    .click(function () {
      task.task_name = $("#taskName").val();
      task.task_description = $("#taskDescription").val();
      task.task_group_id = parseInt($("#taskGroupId").val());
      task.auto_start = $("#autoStart").val() === "true";
      task.last_updated_date = new Date().toISOString();

      renderTasks();
      closeModal();
      resetTaskForm(); // Reset form
    });

  $("#taskModal").modal("show");
});

function closeModal() {
  $("#taskModal").modal("hide");
  $(".modal-backdrop").remove(); // Remove lingering backdrop
  $("body").removeClass("modal-open"); // Unlock scrolling
  resetTaskForm(); // Reset form fields
}

// Initial render
$(document).ready(function () {
  populateTaskGroups(); // Populate dropdown
  renderTasks(); // Render tasks
});
