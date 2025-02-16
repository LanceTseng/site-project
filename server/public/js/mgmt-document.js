import * as DocumentApi from "./services/documentServices.js";
import * as FileApi from "./services/fileServices.js";
import { formatDate, isEqualIgnoreCase } from "./utils/stringUtils.js";

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
            ? `<button class="btn btn-sm btn-dark preview-secondary preview-btn" data-path="${item.document_path}">Preview</button>`
            : ""
        }</td>
        <td>${item.require_upload ? "Yes" : "No"}</td>
        <td>
          <button class="btn btn-info btn-sm edit-btn" data-mode="edit" data-id="${
            item.document_id
          }">
            Edit
          </button>

           <button class="btn btn-secondary btn-sm upload-btn" data-mode="upload" data-id="${
             item.document_id
           }">
            Upload
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
  console.log(docPath);
  $("#documentPreview").attr("src", docUrl.fileurl);
}

async function displayNewDocument() {
  $("#modalTitle").html("Add New Document");
  $("#saveDocument").data("mode", "add");
  $("#documentName").val("");
  $("#documentId").val("");
  $("#requireUpload").val("");

  $("#documentModal").modal("dispose").modal("show");
}

async function displayEditDocument(id) {
  const doc = await DocumentApi.getTaskById(id);

  $("#modalTitle").html("Edit Document");
  $("#saveDocument").data("mode", "edit");
  $("#saveDocument").data("id", id);
  $("#documentName").val(doc.document_name);
  $("#documentId").val(doc.document_id);
  $("#requireUpload").val(doc.require_upload);

  $("#documentModal").modal("dispose").modal("show");
}

async function saveDocument() {
  try {
    const mode = $("#saveDocument").data("mode");
    console.log(mode);

    const docEdit = {
      document_id: $("#documentId").val() || -1,
      document_name: $("#documentName").val(),
      require_upload: $("#requireUpload").val(),
    };

    console.log(docEdit);

    if (isEqualIgnoreCase(mode, "add")) {
      await DocumentApi.createTask(docEdit);
    }
    if (isEqualIgnoreCase(mode, "edit")) {
      const id = $("#saveDocument").data("id");
      const existDoc = await DocumentApi.getTaskById(id);
      Object.assign(existDoc, docEdit);
      await DocumentApi.updateTask(id, docEdit);
    }

    Swal.fire("Success", `Document ${mode} successfully!`, "success");

    loadDocument();
  } catch (error) {
    console.error(error.message);
    Swal.fire("Error", `Failed to ${mode} document!`, "error");
  }
}

async function uploadFile(id) {
  try {
    // Create a hidden file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "*/*";
    fileInput.style.display = "none";

    document.body.appendChild(fileInput); // Ensure the input is attached

    fileInput.addEventListener("change", async function () {
      if (!fileInput.files.length) return;

      const selectedFile = fileInput.files[0];

      try {
        // Upload file using Axios
        const response = await FileApi.uploadOfficalFile(selectedFile);

        // Update child task document
        const doc = await DocumentApi.getTaskById(id);
        doc.document_path = response.filename;
        await DocumentApi.updateTask(id, doc);

        fileInput.value = ""; // Reset input after upload

        Swal.fire("Success!", "File uploaded successfully.", "success");

        loadDocument();
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        await Swal.fire("Error", "File upload failed.", "error");
      } finally {
        document.body.removeChild(fileInput); // Cleanup
      }
    });

    fileInput.click(); // Trigger file selection
  } catch (error) {
    console.error("Unexpected error:", error);
    Swal.fire("Error", "Something went wrong.", "error");
  }
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

  $("#documentTableBody").on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    displayEditDocument(id);
  });

  $("#documentTableBody").on("click", ".upload-btn", function () {
    const id = $(this).data("id");
    uploadFile(id);
  });

  // ➕ Add Document Button
  $("#addDocumentBtn").click(function () {
    displayNewDocument();
  });

  $("#documentForm").on("submit", function (e) {
    e.preventDefault();
    saveDocument();
    $("#documentModal").modal("hide");
  });
});
