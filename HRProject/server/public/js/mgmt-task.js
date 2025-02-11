import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import { formatDate } from "./utils/stringUtils.js";

// Populate task group dropdown
async function populateTaskGroups() {
  const taskGroupDropdown = $("#taskGroupId");
  taskGroupDropdown.empty();
  taskGroupDropdown.append(
    '<option value="" disabled selected>Select a Group</option>'
  );

  try {
    const task_groups = await ObjectTypeApi.getTaskByName("task_group");
    task_groups.forEach((group) => {
      taskGroupDropdown.append(
        `<option value="${group.object_type_item_key}">${group.object_type_item_value}</option>`
      );
    });
  } catch (error) {
    console.error("Error loading task groups:", error);
  }
}

// Render tasks
async function renderTasks() {
  const taskTableBody = $("#taskTable tbody");
  taskTableBody.empty();

  try {
    const parent_tasks = await ParentTaskApi.getTasks();
    const task_groups = await ObjectTypeApi.getTaskByName("task_group");

    parent_tasks.forEach((task) => {
      const taskGroup = task_groups.find(
        (g) => g.object_type_item_key == task.task_group_id
      );
      const taskGroupName = taskGroup
        ? taskGroup.object_type_item_value
        : "Unknown Group"; // Handle missing groups

      const row = `
        <tr data-id="${task.task_id}">
          <td>${task.task_id}</td>
          <td>${task.task_name}</td>
          <td>${task.task_description}</td>
          <td>${taskGroupName}</td>
          <td hidden>${task.task_group_id}</td>
          <td>${formatDate(task.created_date)}</td>
          <td>${formatDate(task.last_updated_date)}</td>
          <td>
            <button class="btn btn-info btn-sm edit-task" data-id="${
              task.task_id
            }">Edit</button>
            <a href="/mgmt-subtask/${
              task.task_id
            }" class="btn btn-primary btn-sm">Add Subtask</a>
          </td>
        </tr>
      `;
      taskTableBody.append(row);
    });
  } catch (error) {
    console.error("Error rendering tasks:", error);
  }
}

// Reset modal form
function resetTaskForm() {
  $("#taskName").val("");
  $("#taskDescription").val("");
  $("#taskGroupId").val("");
}

// Create new task
$("#saveTask").click(async function () {
  const taskName = $("#taskName").val();
  const taskDescription = $("#taskDescription").val();
  const taskGroupId = parseInt($("#taskGroupId").val(), 10); // Ensure proper integer conversion

  if (!taskName || !taskGroupId) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    await ParentTaskApi.createTask({
      task_name: taskName,
      task_description: taskDescription,
      task_group_id: taskGroupId,
    });

    await renderTasks();
    closeModal();
  } catch (error) {
    console.error("Error creating task:", error);
  }
});

// Edit task
$(document).on("click", ".edit-task", async function () {
  const taskId = $(this).data("id");

  try {
    const task = await ParentTaskApi.getTaskById(taskId);
    $("#taskName").val(task.task_name);
    $("#taskDescription").val(task.task_description);
    $("#taskGroupId").val(task.task_group_id);

    $("#saveTask")
      .off("click")
      .one("click", async function () {
        task.task_name = $("#taskName").val();
        task.task_description = $("#taskDescription").val();
        task.task_group_id = parseInt($("#taskGroupId").val(), 10);

        try {
          await ParentTaskApi.updateTask(taskId, task);
          await renderTasks();
          closeModal();
        } catch (error) {
          console.error("Error updating task:", error);
        }
      });

    $("#taskModal").modal("show");
  } catch (error) {
    console.error("Error fetching task for editing:", error);
  }
});

// Close modal and reset form
function closeModal() {
  $("#taskModal").modal("hide");
  $(".modal-backdrop").remove();
  $("body").removeClass("modal-open");
  resetTaskForm();
}

// Initial render
$(document).ready(function () {
  populateTaskGroups();
  renderTasks();
});
