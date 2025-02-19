import * as UserFormViewApi from "./services/userFormViewServices.js";

async function populateFormContent(lineId) {
  try {
    const surveyContent = await UserFormViewApi.getAllUserTasksByLineId(lineId);
    console.log(surveyContent);

    if (!surveyContent || surveyContent.length === 0) {
      $("#survey-content").html(
        `<p class="text-muted text-center">No survey responses found.</p>`
      );
      return;
    }

    const contentContainer = $("#survey-content");
    contentContainer.empty(); // Clear existing content

    surveyContent.forEach((s, index) => {
      const questionHtml = `
        <div class="mb-3">
          <h5 class="font-weight-bold">Q${index + 1}: ${
        s.question_display
      }</h5>
          <p class="text-muted">Response: <strong>${
            s.question_response || "No response"
          }</strong></p>
          <hr>
        </div>
      `;
      contentContainer.append(questionHtml);

      $("#form-title").html(s.form_name);
    });
  } catch (error) {
    console.error("Error loading survey content:", error);
    $("#survey-content").html(
      `<p class="text-danger">Failed to load survey responses.</p>`
    );
  }
}

$(document).ready(async function () {
  const pathParts = window.location.pathname.split("/");
  const lineIdIndex = pathParts.indexOf("form-review") + 1;

  const lineId = lineIdIndex > 0 ? pathParts[lineIdIndex] : null;

  if (lineId) {
    await populateFormContent(lineId);
  } else {
    $("#survey-content").html(
      `<p class="text-danger">Invalid survey link.</p>`
    );
  }

  $("#backBtn").click(function () {
    window.location.href = "/report-user-task"; // Redirect to previous page
  });
});
