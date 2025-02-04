import {
  tasks,
  subtasks,
  training_modules,
  object_type,
  interviews,
  surveys,
  user_task_head,
  user_task_detail,
} from "./mockdata.js"; // Adjust the path as necessary
import {
  documents,
} from "./mockdata2.js"; // Adjust the path as necessary

// Wait for the DOM to be fully loaded before processing
$(document).ready(function () {
  // Initially display all tasks when the page is rendered
  displayUserTaskHeader(user_task_head);

  // Attach click event using event delegation to handle clicks on dynamically generated rows
  $("#userTaskHeaderList").on("click", ".task-row", function () {
    const taskHeadId = $(this).data("task-head-id"); // Corrected data attribute
    console.log(taskHeadId); // Log the taskHeadId
    displayUserTaskDetail(taskHeadId);
  });

  // Event to process query and filter tasks based on user input
  // $("#processQuery").on("click", function () {
  //   const filterText = $("#taskFilter").val().toLowerCase();
  //   const filteredTasks = tasks.filter((task) =>
  //     task.task_name.toLowerCase().includes(filterText)
  //   );

  //   // Display filtered task headers
  //   displayUserTaskHeader(filteredTasks);
  // });
});

function displayUserTaskHeader(user_task_head) {
  // Pass user_task_head and use it to render the grid
  const taskRows = tasks
    .map((task) => {
      // Find the user_task_head for the specific task
      const taskHead = user_task_head.find(
        (taskItem) => taskItem.task_id === task.id
      );

      if (!taskHead) return ""; // If no corresponding task_head found, skip this row

      // Find the corresponding task details using head_id
      const taskDetails = user_task_detail.filter(
        (detail) => detail.head_id === taskHead.id
      );

      // Display each task row with details from user_task_head
      return `
        <tr class="task-row" data-task-head-id="${taskHead.id}">
          <td>${task.task_name}</td>
          <td>${task.task_description}</td>
          <td>${taskHead.task_status}</td>
          <td>${taskHead.process_rate}%</td>
          <td>${new Date(taskHead.start_date).toLocaleDateString()}</td>
          <td>${new Date(taskHead.create_date).toLocaleDateString()}</td>
          <td>${new Date(taskHead.last_updated_date).toLocaleDateString()}</td>
          <td>
            ${
            
              taskHead.task_status === "Pending"
              ? `<button class="btn btn-primary btn-sm start-task">Start</button>`
              : taskHead.task_status === "Processing"
              ? `<button class="btn btn-success btn-sm complete-task">Complete</button>`
              : "" 
            }
            </td> 
        </tr>
      `;
    })
    .join("");

  $("#userTaskHeaderList").html(taskRows);

  // Attach click event to each task row to show task details
  $(".task-row").on("click", function () {
    const taskHeadId = $(this).data("task-head-id");
    displayUserTaskDetail(taskHeadId);
  });
}

// Function to display user task details when a task is clicked
function displayUserTaskDetail(taskHeadId) {
  const taskHead = user_task_head.find((task) => task.id === taskHeadId);

  if (!taskHead) return;

  // Find the related task details using head_id
  const taskDetails = user_task_detail.filter(
    (detail) => detail.head_id === taskHead.id
  );

  const taskDetailRows = taskDetails
    .map(
      (detail) => `
      <tr>
        <td>${
          subtasks.find((s) => s.id == detail.subtask_id)?.subtask_name || "N/A"
        }</td>
        <td>${
          subtasks.find((s) => s.id == detail.subtask_id)
            ?.subtask_description || "N/A"
        }</td>
         <td>${
          detail.task_status
        }</td>
        <td>${
          documents.find((doc) => doc.id === detail.document_id)
            ?.document_name || "N/A"
        }</td>
        <td>${
          object_type.find((type) => type.id === detail.device_type_id)
            ?.object_type || "N/A"
        }</td>
        <td>${
          training_modules.find(
            (module) => module.id === detail.training_module_id
          )?.training_name || "N/A"
        }</td>
        <td>${
          interviews.find((interview) => interview.id === detail.interview_id)
            ?.interview_name || "N/A"
        }</td>
        <td>${
          surveys.find((survey) => survey.id === detail.survey_id)
            ?.survey_name || "N/A"
        }</td>
        <td>${new Date(detail.start_date).toLocaleDateString()}</td>
        <td>${new Date(detail.create_date).toLocaleDateString()}</td>
        <td>${new Date(detail.last_updated_date).toLocaleDateString()}</td>
         <td>
    ${
     
        detail.task_status === "Pending"
              ? `<button class="btn btn-primary btn-sm start-task">Start</button>`
              : taskHead.task_status === "Processing"
              ? `<button class="btn btn-success btn-sm complete-task">Complete</button>`
              : "" 
    }
  </td>
      </tr>
    `
    )
    .join("");

  $("#userTaskDetailList").html(taskDetailRows);
}
