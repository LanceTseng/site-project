import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as RelUserHandoverApi from "./services/relUserHandoverServices.js";

let line_id;
let quill;

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
  console.log("click");
  const content = quill.root.innerHTML; // Get HTML content
  await RelUserHandoverApi.createRelUserHandover({
    user_childtask_id: line_id,
    handover_user_id: $("#handoverPerson").val(),
    handover_note: content,
  });

  Swal.fire("Success", `Submit successfully!`, "success");
  await new Promise((resolve) => setTimeout(resolve, 1500));
  window.location.href = "/report-user-task"; // Change this to your desired URL
}

$(document).ready(function () {
  // Your code here
  const pathParts = window.location.pathname.split("/"); // Split by "/"

  // Find dynamic parameters based on your URL structure
  const lineIdIndex = pathParts.indexOf("lineid") + 1; // Get index after 'lineid'
  // Extract formId and lineId safely
  line_id = lineIdIndex > 0 ? pathParts[lineIdIndex] : null;

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
