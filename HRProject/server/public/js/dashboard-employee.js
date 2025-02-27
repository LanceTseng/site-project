import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as UserTaskViewApi from "./services/userTaskViewServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

let loginUser = "";

$(document).ready(async function () {
  loginUser = JSON.parse(sessionStorage.getItem("user"));

  $("#employeeName").text(`${loginUser.username} - ${loginUser.user_role}`);

  try {
    // Fetch main tasks
    const data = await UserTaskViewApi.getUserParentTaskByUserId(loginUser.user_id);
    if (!Array.isArray(data)) {
      console.error("Invalid main tasks format:", data);
      return;
    }

    // Fetch employee details
    const employeeData = await UserEmployeeViewApi.getUserEmployeeByUserId(loginUser.user_id);
    if (!employeeData) {
      console.error("Employee data not found.");
      return;
    }

    // Fetch child tasks
    const userChildTask = await UserTaskViewApi.getUserTaskByUserId(loginUser.user_id);

    if (!Array.isArray(userChildTask)) {
      console.error("Invalid child task format:", userChildTask);
      return;
    }

    // Count statistics
    const processingMainTask = data.filter((o) => o.pt_status == 1).length;
    const pendingMainTask = data.filter((o) => o.pt_status == 0).length;
    const tenureDays = Math.floor(
      (new Date() - new Date(employeeData.onboard_date)) / (1000 * 60 * 60 * 24)
    );
    const employeeStatus = employeeData.status_name;

    // Update UI
    $("#processingMainTask").text(processingMainTask);
    $("#pendingMainTask").text(pendingMainTask);
    $("#tenureDays").text(tenureDays);
    $("#employeeStatus").text(employeeStatus);

    // Populate Recent Activities Table
    const tableBody = $("#recentActivities").empty(); // Clear existing rows

    const recentActivities = data.sort(
      (a, b) => new Date(b.last_updated_date) - new Date(a.last_updated_date)
    );

    if (recentActivities.length > 0) {
      recentActivities.forEach((task) => {
        const statusClasses = {
          completed: "bg-success",
          pending: "bg-info",
          processing: "bg-warning",
        };

        const badgeClass = statusClasses[task.pt_status_name?.toLowerCase()] || "bg-secondary";
        const childTask = userChildTask.filter((o) => o.head_id === task.head_id).length;
        const childTaskCompleted = userChildTask.filter((o) => o.head_id === task.head_id && o.ct_status === 2).length;

        // Avoid division by zero
        const completionRate = childTask > 0 ? ((childTaskCompleted / childTask) * 100).toFixed(2) : "0.00";

        const row = `
          <tr>
            <td>${task.pt_name}</td>
            <td><span class="badge ${badgeClass}">${capitalize(task.pt_status_name)}</span></td>
            <td>${completionRate}%</td>
            <td>${formatDate(task.last_updated_date)}</td>
          </tr>`;

        tableBody.append(row);
      });
    } else {
      tableBody.append(
        '<tr><td colspan="4" class="text-center">No recent activities</td></tr>'
      );
    }
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    $("#recentActivities").html(
      '<tr><td colspan="4" class="text-center text-danger">Failed to load data</td></tr>'
    );
  }
});

// Helper functions
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
