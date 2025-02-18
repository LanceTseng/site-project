import * as UserChildTaskApi from "./services/relUserChildTaskServices.js";
import * as UserFormApi from "./services/relUserFormServices.js";
import * as UserFormViewApi from "./services/userFormViewServices.js";
import * as FormDesignViewApi from "./services/formDesignViewServices.js";

let surveyQuestions = []; // Move surveyQuestions to a global scope

async function populateFormTitle(title) {
  $("#form-title").html(title);
}

async function populateFormContent(formId) {
  try {
    const surveyContent = await FormDesignViewApi.getFormDesignViewByFormId(
      formId
    );

    surveyQuestions = []; // Reset before populating
    let formTitle = "";

    surveyContent.forEach((item) => {
      formTitle = item.form_name;
      surveyQuestions.push({
        id: item.form_question_id, // Fixed: Use form_question_id instead of form_question_type_id
        question: item.form_question_display,
        type: item.form_question_type_name,
      });
    });

    populateFormTitle(formTitle);

    console.log(surveyContent);

    const form = $("#surveyForm");
    form.empty(); // Clear form before repopulating

    surveyQuestions.forEach((question) => {
      const questionDiv = $("<div>").addClass("form-group");
      $("<label>")
        .text(question.question)
        .addClass("form-label fw-bold")
        .appendTo(questionDiv);

      switch (
        question.type.toLowerCase() // Case insensitive check
      ) {
        case "1-5":
          const ratingGroup = $("<div>").addClass("d-flex gap-2");
          for (let i = 1; i <= 5; i++) {
            const radio = $("<input>")
              .attr({
                type: "radio",
                name: `q${question.id}`,
                value: i,
                id: `q${question.id}-${i}`,
              })
              .addClass("btn-check");
            const label = $("<label>")
              .attr("for", `q${question.id}-${i}`)
              .addClass("btn btn-outline-primary btn-sm")
              .text(i);
            ratingGroup.append(radio, label);
            if (i === 1) radio.prop("checked", true);
          }
          questionDiv.append(ratingGroup);
          break;

        case "short-answer":
          $("<input>")
            .attr({ type: "text", name: `q${question.id}` })
            .addClass("form-control")
            .appendTo(questionDiv);
          break;

        case "long-answer":
          $("<textarea>")
            .attr({ name: `q${question.id}`, rows: 3 })
            .addClass("form-control")
            .appendTo(questionDiv);
          break;

        case "yes-no":
          const yesRadio = $("<input>")
            .attr({
              type: "radio",
              name: `q${question.id}`,
              value: "yes",
              id: `q${question.id}-yes`,
            })
            .addClass("btn-check");
          const noRadio = $("<input>")
            .attr({
              type: "radio",
              name: `q${question.id}`,
              value: "no",
              id: `q${question.id}-no`,
            })
            .addClass("btn-check");

          const yesLabel = $("<label>")
            .attr("for", `q${question.id}-yes`)
            .addClass("btn btn-outline-success")
            .text("Yes");
          const noLabel = $("<label>")
            .attr("for", `q${question.id}-no`)
            .addClass("btn btn-outline-danger")
            .text("No");

          const btnGroup = $("<div>")
            .addClass("d-flex gap-2")
            .append(yesRadio, yesLabel, noRadio, noLabel);
          questionDiv.append(btnGroup);

          yesRadio.prop("checked", true);
          break;
      }

      questionDiv.appendTo(form);
    });
  } catch (error) {
    console.error("Error loading survey:", error);
  }
}

async function submitSurvey(formId, lineId) {
  try {
    const answers = [];
    surveyQuestions.forEach((question) => {
      const answer =
        $(`[name="q${question.id}"]:checked`).val() ||
        $(`[name="q${question.id}"]`).val();

      const result = {
        form_question_id: question.id,
        form_question_response: answer ? answer.trim() : "",
      };
      answers.push(result);
    });

    console.log("Survey Responses:", answers);

    if (Object.values(answers).some((val) => val === "")) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please answer all questions before submitting.",
      });
      return;
    }

    const existSurvey = await UserFormViewApi.getAllUserTasksByLineId(lineId);

    if (!existSurvey || existSurvey.length === 0) {
      for (const a of answers) {
        // Use for...of to handle async/await properly
        const userform = {
          id: null,
          form_id: formId,
          form_question_id: a.form_question_id,
          form_question_response: a.form_question_response,
          user_childtask_id: lineId,
        };

        await UserFormApi.createTask(userform);
      }
    } else {
      for (const e of existSurvey) {
        // Use for...of to handle async/await properly
        const newResponse = answers.find(
          (a) => a.form_question_id === e.form_question_id
        );

        if (newResponse) {
          e.form_question_response = newResponse.form_question_response;
          await UserFormApi.updateTask(e.id, e);
        }
      }
    }

    Swal.fire({
      icon: "success",
      title: "Thank You!",
      text: "Survey submitted successfully!",
    }).then(() => {
      $("#surveyForm").empty(); // Clear form only after successful submission
      window.location.href = "/report-user-task"; // Change this to your desired URL
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Failed to submit the survey.",
    });
    console.error("Survey submission error:", error);
  }
}

$(document).ready(async function () {
  const pathParts = window.location.pathname.split("/"); // Split by "/"

  // Find dynamic parameters based on your URL structure
  const formIdIndex = pathParts.indexOf("form") + 1; // Get index after 'form'
  const lineIdIndex = pathParts.indexOf("lineid") + 1; // Get index after 'lineid'
  // Extract formId and lineId safely
  const formId = formIdIndex > 0 ? pathParts[formIdIndex] : null;
  const lineId = lineIdIndex > 0 ? pathParts[lineIdIndex] : null;

  populateFormContent(formId);

  $("#submitBtn").click(async function () {
    submitSurvey(formId, lineId);
  });
});
