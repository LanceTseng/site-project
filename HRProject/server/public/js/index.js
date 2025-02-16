import * as EmployeeViewApi from "./services/employeeViewService.js";

$(document).ready(async function () {
  try {
    const data = await EmployeeViewApi.getTasks();

    if (!Array.isArray(data)) {
      console.error("Invalid data format:", data);
      return;
    }

    // Count statistics
    const activeOnboarding = data.filter((o) => o.status == 1).length;
    const pendingOffboarding = data.filter((o) => o.status == 2).length;
    const totalEmployees = data.length;
    const recentHires = data.filter((o) => [0, 1, 3].includes(o.status)).length;

    // Update UI
    $("#activeOnboarding").text(activeOnboarding);
    $("#pendingOffboarding").text(pendingOffboarding);
    $("#totalEmployees").text(totalEmployees);
    $("#recentHires").text(recentHires);

    // Populate Recent Activities Table
    const tableBody = $("#recentActivities").empty(); // Clear existing rows

    const recentActivities = data
      .filter((o) => [0, 1, 3].includes(o.status)) // Filter by status
      .sort((a, b) => {
        return new Date(b.last_updated_date) - new Date(a.last_updated_date);
      });

    if (recentActivities.length > 0) {
      const statusClasses = {
        onboarding: "bg-success",
        pending: "bg-info",
        offboarding: "bg-danger",
      };

      recentActivities.forEach((employee) => {
        console.log(employee);
        const badgeClass =
          statusClasses[employee.status_name] || "bg-secondary"; // Default class

        const row = `
          <tr>
            <td>${employee.first_name} ${employee.last_name}</td>
            <td>${employee.department_name}</td>
            <td><span class="badge ${badgeClass}">${capitalize(
          employee.status_name
        )}</span></td>
            <td>${formatDate(employee.last_updated_date)}</td>
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
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "N/A";
