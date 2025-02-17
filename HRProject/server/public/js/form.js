



$(document).ready(function () {
  const surveyQuestions = [
    { id: 1, question: "How satisfied are you with our service?", type: "1-5" },
    { id: 2, question: "What could we improve?", type: "short-answer" },
    { id: 3, question: "Would you recommend us to others?", type: "yes-no" },
    { id: 4, question: "Any other comments?", type: "long-answer" },
  ];

  const form = $("#surveyForm");

  surveyQuestions.forEach((question) => {
    const questionDiv = $("<div>").addClass("form-group");
    $("<label>")
      .text(question.question)
      .addClass("form-label fw-bold")
      .appendTo(questionDiv);

    switch (question.type) {
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

  $("#submitBtn").click(async function () {
    const answers = {};
    surveyQuestions.forEach((question) => {
      const answer =
        $(`[name="q${question.id}"]:checked`).val() ||
        $(`[name="q${question.id}"]`).val();
      answers[`q${question.id}`] = answer || "";
    });

    console.log("Survey Responses:", answers);

    if (Object.values(answers).some((val) => val.trim() === "")) {
      Swal.fire({
        icon: "warning",
        title: "Oops!",
        text: "Please answer all questions before submitting.",
      });
      return;
    }

    try {
      const response = await axios.post("/submit-survey", answers);
      Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Survey submitted successfully!",
      }).then(() => {
        $("#surveyForm").empty();
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to submit the survey.",
      });
      console.error("Survey submission error:", error);
    }
  });
});
