import * as ParentTaskApi from "./services/parentTaskServices.js";
import * as ObjectTypeApi from "./services/objectTypeServices.js";
import { formatDate } from "./utils/stringUtils.js";

// Populate task group dropdown
async function populateTaskGroups() {
  const taskGroupDropdown = $("#taskGroupId");
  taskGroupDropdown
    .empty()
    .append('<option value="" disabled selected>Select a Group</option>');

  try {
    const taskGroups = await ObjectTypeApi.getTaskByName("task_group");
    taskGroups.forEach(({ object_type_item_key, object_type_item_value }) => {
      taskGroupDropdown.append(
        `<option value="${object_type_item_key}">${object_type_item_value}</option>`
      );
    });
  } catch (error) {
    console.error("Error loading task groups:", error);
  }
}

// Render tasks in the table
async function renderTasks() {
  const taskTableBody = $("#taskTable tbody");
  taskTableBody.empty();

  try {
    const [parentTasks, taskGroups] = await Promise.all([
      ParentTaskApi.getTasks(),
      ObjectTypeApi.getTaskByName("task_group"),
    ]);

    const taskGroupMap = new Map(
      taskGroups.map((g) => [g.object_type_item_key, g.object_type_item_value])
    );

    parentTasks.forEach(
      ({
        task_id,
        task_name,
        task_description,
        task_group_id,
        created_date,
        last_updated_date,
      }) => {
        const taskGroupName =
          taskGroupMap.get(task_group_id) || "Unknown Group";
        taskTableBody.append(`
        <tr data-id="${task_id}">
          <td>${task_id}</td>
          <td>${task_name}</td>
          <td>${task_description}</td>
          <td>${taskGroupName}</td>
          <td hidden>${task_group_id}</td>
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

// Reset modal form
function resetTaskForm() {
  $("#taskName, #taskDescription, #taskGroupId").val("");
}

// Handle save task
async function saveTask() {
  const taskName = $("#taskName").val();
  const taskDescription = $("#taskDescription").val();
  const taskGroupId = parseInt($("#taskGroupId").val(), 10);

  if (!taskName || isNaN(taskGroupId)) {
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
    Swal.fire("Success", `Add successfully!`, "success");
    closeModal();
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

// Handle edit task
async function editTask(taskId) {
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
          Swal.fire("Success", `Edit successfully!`, "success");
          closeModal();
        } catch (error) {
          console.error("Error updating task:", error);
        }
      });

    $("#taskModal").modal("show");
  } catch (error) {
    console.error("Error fetching task for editing:", error);
  }
}

// Close modal and reset form
function closeModal() {
  $("#taskModal").modal("hide");
  $(".modal-backdrop").remove();
  $("body").removeClass("modal-open");
  resetTaskForm();
}

// Event Listeners
$(document).ready(function () {
  populateTaskGroups();
  renderTasks();
  $("#saveTask").click(saveTask);
  $(document).on("click", ".edit-task", function () {
    editTask($(this).data("id"));
  });
});
