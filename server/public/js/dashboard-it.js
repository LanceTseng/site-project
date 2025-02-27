import * as UserTaskViewApi from "./services/userTaskViewServices.js";
import * as EquipmentViewApi from "./services/equipmentViewServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

let loginUser = "";
$(document).ready(async function () {
  loginUser = JSON.parse(sessionStorage.getItem("user"));

  $("#employeeName").text(`${loginUser.username} - ${loginUser.user_role}`);

  try {
    const data = await EquipmentViewApi.getEqpts();
    if (!Array.isArray(data)) {
      console.error("Invalid fetch data:", data);
      return;
    }
    //fetch user task
    const tasks = await UserTaskViewApi.getAllUserTasks();

    const totalEquipment = data.length;
    const occupiedEquipment = data.filter((o) => o.occupied == 1).length;
    const taskRequsetEquip = tasks.filter(
      (o) =>
        o.equipment_type_id != null && [1, 2].some((x) => x === o.ct_status)
    ).length;
    const taskRequestClose = tasks.filter(
      (o) =>
        o.equipment_type_id !== null &&
        o.ct_status === 2 &&
        formatDate(o.ct_end_date) === formatDate(Date.now())
    ).length;

    // Update UI
    $("#totalEquipment").text(totalEquipment);
    $("#occupiedEquipment").text(occupiedEquipment);
    $("#openTicket").text(taskRequsetEquip);
    $("#todayComplete").text(taskRequestClose);

    // Populate Recent Activities Table
    const tableBody = $("#recentActivities").empty(); // Clear existing rows

    const recentActivities = data.sort(
      (a, b) => new Date(b.last_update_date) - new Date(a.last_update_date)
    );

    if (recentActivities.length > 0) {
      recentActivities.forEach((eqpt) => {
        const statusClasses = {
          0: "bg-success",
          1: "bg-warning",
        };

        const badgeClass =
          statusClasses[eqpt.occupied] || "bg-secondary";

        const row = `
              <tr>
                <td>${eqpt.equipment_name}</td>
                <td><span class="badge ${badgeClass}">${eqpt.occupied == 1? "Y" : "N"}</span></td>
                <td>${eqpt.occupied_by_name ?? ""}</td>
                <td>${formatDate(eqpt.last_update_date  )}</td>
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
