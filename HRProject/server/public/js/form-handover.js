import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as RelUserHandoverApi from "./services/relUserHandoverServices.js";
import { isEqualIgnoreCase, formatDate } from "./utils/stringUtils.js";

let line_id;
let quill;
let mode;

async function populateHandoverDropdown() {
  const $interviewDropdown = $("#handoverPerson");
  $interviewDropdown.empty();

  // Add default option
  $interviewDropdown.append(
    `<option value="" disabled selected>Select a person</option>`
  );

  const response = await UserEmployeeViewApi.getUserEmployeeByEmployeeStatus(3);
  // Populate options from response array
  response.forEach((p) => {
    $interviewDropdown.append(
      `<option value="${p.user_id}">${p.username}</option>`
    );
  });
}

async function saveHandover() {
  const content = quill.root.innerHTML; // Get HTML content

  if (isEqualIgnoreCase(mode, "add")) {
    await RelUserHandoverApi.createRelUserHandover({
      user_childtask_id: line_id,
      handover_user_id: $("#handoverPerson").val(),
      handover_note: content,
    });
  } else {
    const response = await RelUserHandoverApi.getRelUserHandoverByChildTaskId(
      line_id
    );

    const handover = response.length > 0 ? response[0] : null; // Ensure handover exists
    handover.handover_note = content;
    await RelUserHandoverApi.updateRelUserHandover(handover.id, handover);
  }

  Swal.fire("Success", `Submit successfully!`, "success");
  await new Promise((resolve) => setTimeout(resolve, 1500));
  window.location.href = "/report-user-task"; // Change this to your desired URL
}

async function retrieve() {
  const response = await RelUserHandoverApi.getRelUserHandoverByChildTaskId(
    line_id
  );

  const handover = response.length > 0 ? response[0] : null; // Ensure handover exists

  if (isEqualIgnoreCase(mode, "review")) {
    $("#btn-save").hide();

    if (handover) {
      $("#handoverPerson").val(handover.handover_user_id);
      quill.root.innerHTML = handover.handover_note;
    }

    return;
  }

  mode = handover ? "edit" : "add"; // ✅ Correct mode assignment

  if (handover) {
    $("#handoverPerson").val(handover.handover_user_id);
    quill.root.innerHTML = handover.handover_note;
  }
}

$(document).ready(function () {
  // Your code here
  const pathParts = window.location.pathname.split("/"); // Split by "/"

  // Find dynamic parameters based on your URL structure
  const lineIdIndex = pathParts.indexOf("lineid") + 1; // Get index after 'lineid'
  const reviewIndex = pathParts.indexOf("review") + 1; // Get index after 'lineid'
  // Extract formId and lineId safely
  line_id =
    lineIdIndex > 0
      ? pathParts[lineIdIndex]
      : reviewIndex > 0
      ? pathParts[reviewIndex]
      : null;

  mode = reviewIndex > 0 ? "review" : "";

  retrieve();

  //text area
  quill = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block"],
      ],
    },
    placeholder: "Compose an epic...",
  });

  populateHandoverDropdown();

  $("#btn-save").on("click", (e) => {
    e.preventDefault();
    saveHandover();
  });
});
