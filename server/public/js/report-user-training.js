import * as UserTrainingApi from "./services/userTrainingServices.js";
import { accessVerify } from "./utils/authVerify.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

let loginUser;

async function loadUserTraining() {
  try {
    const response = await UserTrainingApi.getTrainingModuleViewByCondition(); // Ensure it's awaited
     
    const trainingTableBody = $("#trainingTableBody");
    trainingTableBody.empty();

    response.forEach((training) => {
      const row = `
            <tr>
              <td>${training.user_name}</td>
              <td>${training.training_module_name}</td>
              <td>${training.training_status}</td>
              <td>${training.verified_by??""}</td>
              <td>${formatDate(training.start_date)}</td>
              <td>${formatDate(training.end_date)}</td>
              <td>
                <button class="btn btn-primary btn-sm">Start</button>
                 <button class="btn btn-warning btn-sm">Verify</button>
                <button class="btn btn-success btn-sm">Complete</button>
              </td>
            </tr>
          `;
      trainingTableBody.append(row);
    });
  } catch (error) {
    console.error("Error loading user training:", error);
  }
}

$(document).ready(async function () {
  loginUser = JSON.parse(sessionStorage.getItem("user"));
  loadUserTraining();
});
