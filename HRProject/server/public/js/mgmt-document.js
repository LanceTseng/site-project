import * as DocumentApi from "./services/documentServices.js";
import * as FileApi from "./services/fileServices.js";

async function loadDocument() {
  const documents = await DocumentApi.getTasks();
  if (documents.length === 0) {
    console.error("Invalid data format:", documents);
    return;
  }

  const rows = documents
    .map(
      (item) => `
      <tr class="doc-row" data-doc-id="${item.document_id}">
        <td>${item.document_id}</td>
        <td>${item.document_name}</td>
        <td>${
          item.document_path
            ? `<button class="btn btn-sm btn-info preview-secondary preview-btn" data-path="${item.document_path}">Preview</button>`
            : ""
        }</td>
        <td>${item.require_upload ? "Yes" : "No"}</td>
        <td>
          <button class="btn btn-info btn-sm edit-btn" data-mode="edit" data-id="${
            item.equipment_id
          }">
            Edit
          </button>
        </td>
      </tr>
    `
    )
    .join("");

  $("#documentTableBody").html(rows);
}

async function previewFile(docPath) {
  const docUrl = await FileApi.getOfficalFileUrl(docPath);
  $("#documentPreview").attr("src", docUrl.fileurl);
}

$(document).ready(function () {
  // 📌 Load documents on page load
  loadDocument();

  // 🔍 Search Functionality
  $("#searchBtn").click(function () {
    const searchQuery = $("#searchField").val().trim();
    fetchDocuments(searchQuery);
  });

  // 📂 Fetch and display documents
  function fetchDocuments(searchQuery = "") {
    $.get(`${apiUrl}?search=${searchQuery}`, function (data) {
      $("#documentTableBody").empty();
      data.forEach((doc) => {
        $("#documentTableBody").append(generateTableRow(doc));
      });
    }).fail(function (error) {
      console.error("Error fetching documents:", error);
    });
  }

  // 📄 Preview Document
  $("#documentTableBody").on("click", ".preview-btn", function () {
    const filePath = $(this).data("path");
    previewFile(filePath);
  });

  // ⬆️ Handle Upload Button Click
//   $("#documentTableBody").on("click", ".upload-btn", function () {
//     const docId = $(this).data("id");
//     alert(
//       `Upload functionality for document ID: ${docId} will be implemented here.`
//     );
//   });

  // ➕ Add Document Button
  $("#addDocumentBtn").click(function () {
    alert("Show add document form (to be implemented).");
  });
});
