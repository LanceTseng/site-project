import * as DocumentApi from "./services/documentServices.js";
import * as FileApi from "./services/fileServices.js";
// Assuming formatDate is needed for other parts or future use
import { formatDate, isEqualIgnoreCase } from "./utils/stringUtils.js";

// --- DOM Element References ---
const tableBody = $("#documentTableBody");
const documentListFooter = $("#documentListFooter");
const previewFrame = $("#documentPreview");
const previewPlaceholder = $("#previewPlaceholder");
const documentModal = $("#documentModal");
const documentForm = $("#documentForm");
const fileUploadGroup = $("#fileUploadGroup");
const documentFile = $("#documentFile");
const searchInput = $("#searchField");
const searchBtn = $("#searchBtn");
const addDocumentBtn = $("#addDocumentBtn");
const modalTitle = $("#documentModalLabel"); // Corrected Modal Title ID from HTML
const saveDocumentBtn = $("#saveDocument"); // Explicitly reference save button

// --- UI Helper Functions ---

function showPreview(filePath) {
  if (!filePath) {
    showPlaceholder(
      '<span class="text-warning">No preview path available for this document.</span>'
    );
    return;
  }
  previewPlaceholder.hide();
  previewFrame.show().html(""); // Clear previous content before loading potentially slow iframe
  previewFrame.attr("src", "about:blank"); // Prevent loading old content briefly

  // Get the previewable URL from the API
  FileApi.getOfficalFileUrl(filePath)
    .then((response) => {
      if (response && response.fileurl) {
        previewFrame.attr("src", response.fileurl);
      } else {
        showPlaceholder(
          '<span class="text-danger">Could not retrieve preview URL.</span>'
        );
        console.error("Invalid response from getOfficalFileUrl", response);
      }
    })
    .catch((error) => {
      console.error("Error getting preview URL:", error);
      showPlaceholder(
        '<span class="text-danger">Error loading preview.</span>'
      );
    });
}

function showPlaceholder(
  message = '<i class="fas fa-file-alt fa-3x mr-2 text-muted"></i> Select a document from the list to preview it here.'
) {
  previewFrame.hide().attr("src", "about:blank"); // Hide and clear src
  previewPlaceholder.html(message).show();
}

// --- Data Loading and Rendering ---

// Render Table Rows
function renderDocumentList(documents) {
  tableBody.empty();
  if (!documents || documents.length === 0) {
    tableBody.append(
      '<tr><td colspan="5" class="text-center text-muted">No documents found.</td></tr>'
    ); // Updated colspan
    documentListFooter.text("No documents found.");
    showPlaceholder(); // Reset preview when list is empty/reloaded
    return;
  }

  const rows = documents
    .map((item) => {
      // Convert require_upload (likely boolean or 1/0 from DB) to Yes/No display
      const requiresUpload =
        item.require_upload === true || item.require_upload === 1;
      const badgeClass = requiresUpload ? "badge-success" : "badge-danger";
      const badgeText = requiresUpload ? "Yes" : "No";

      // Provide doc_path to the row for easy access on click
      return `
          <tr data-doc-id="${item.document_id}" data-doc-path="${
        item.document_path || ""
      }">
            <td>${item.document_id}</td>
            <td>${item.document_name || "N/A"}</td>
            <td><span class="badge ${badgeClass}">${badgeText}</span></td>
            <td>
              <!-- Edit Button triggers modal -->
              <button class="btn btn-sm btn-info edit-doc-btn" title="Edit Metadata"
                      data-toggle="modal" data-target="#documentModal" data-doc-id="${
                        item.document_id
                      }">
                <i class="fas fa-pencil-alt"></i>
              </button>

              <!-- Upload/Replace Button -->
              <button class="btn btn-sm btn-warning replace-doc-btn" title="Upload/Replace File" data-doc-id="${
                item.document_id
              }">
                <i class="fas fa-upload"></i>
              </button>

              <!-- Delete Button (Optional) -->
              <!--
              <button class="btn btn-sm btn-danger delete-doc-btn" title="Delete Document" data-doc-id="${
                item.document_id
              }">
                <i class="fas fa-trash-alt"></i>
              </button>
              -->

               <!-- View/Preview Button (Alternative to row click) -->
               ${
                 item.document_path
                   ? `<button class="btn btn-sm btn-secondary view-doc-btn" title="Preview Document" data-doc-path="${item.document_path}">
                    <i class="fas fa-eye"></i>
                  </button>`
                   : ""
               }
            </td>
          </tr>
        `;
    })
    .join("");

  tableBody.html(rows);
  documentListFooter.text(`${documents.length} document(s) found.`);
  showPlaceholder(); // Reset preview when list reloads
}

// Fetch documents from API
async function loadDocuments(searchQuery = "") {
  tableBody.html(
    '<tr><td colspan="5" class="text-center"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>'
  ); // Update colspan
  documentListFooter.text("Loading...");
  showPlaceholder(); // Reset preview

  try {
    // Adapt API call if search is implemented server-side
    let documents = await DocumentApi.getTasks();
    if (searchQuery) {
      documents = documents.filter((x) =>
        x.document_name.includes(searchQuery)
      );
    }

    renderDocumentList(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    tableBody.html(
      '<tr><td colspan="5" class="text-center text-danger">Error loading documents.</td></tr>'
    ); // Update colspan
    documentListFooter.text("Error loading.");
    Swal.fire("Error", "Could not fetch documents.", "error");
  }
}

// --- Modal and Form Handling ---

async function handleModalOpen(event) {
  const button = $(event.relatedTarget); // Button that triggered the modal
  const docId = button.data("doc-id"); // Extract document ID
  const modal = $(this); // The modal itself

  documentForm[0].reset(); // Clear previous data
  $("#documentId").val(""); // Clear hidden ID
  fileUploadGroup.hide(); // Hide file upload by default
  documentFile.removeAttr("required"); // Remove required attribute
  saveDocumentBtn.prop("disabled", false).html("Save Document"); // Reset button state

  if (docId) {
    // --- EDIT MODE ---
    modalTitle.text("Edit Document Metadata");
    $("#documentId").val(docId);

    try {
      // Fetch document details via API using docId
      const doc = await DocumentApi.getTaskById(docId);
      if (doc) {
        $("#documentName").val(doc.document_name);
        // Convert boolean/number require_upload to string 'true'/'false' for select value
        $("#requireUpload").val(
          String(
            doc.require_upload === true || doc.require_upload === 1
          ).toLowerCase()
        );
      } else {
        throw new Error("Document not found");
      }
    } catch (error) {
      console.error(`Error fetching document ${docId} details:`, error);
      Swal.fire("Error", "Could not load document details.", "error");
      modal.modal("hide"); // Hide modal if data loading fails
    }
  } else {
    // --- ADD MODE ---
    modalTitle.text("Add New Document");
    // ** Important: Show file input ONLY IF your workflow requires upload on Add **
    // If upload is always separate via the "Upload" button, keep this hidden.
    // fileUploadGroup.show();
    // documentFile.attr('required', true);

    // Set default for 'Require Upload' (e.g., 'false')
    $("#requireUpload").val("false");
  }
}

// Handle Form Submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const docId = $("#documentId").val();
  const isUpdating = !!docId;
  const modeLabel = isUpdating ? "update" : "create";

  // Disable button to prevent double submission
  saveDocumentBtn
    .prop("disabled", true)
    .html('<i class="fas fa-spinner fa-spin"></i> Saving...');

  // --- Option 1: Metadata only (Upload handled separately) ---
  const docMetadata = {
    document_name: $("#documentName").val(),
    require_upload: $("#requireUpload").val() === "true", // Convert back to boolean
  };

  try {
    if (isUpdating) {
      const existingDoc = await DocumentApi.getTaskById(docId); // Optional: Fetch existing if needed for merge
      // Object.assign(existingDoc, docMetadata); // Merge if necessary
      await DocumentApi.updateTask(docId, docMetadata);
    } else {
      await DocumentApi.createTask(docMetadata);
    }

    Swal.fire(
      "Success",
      `Document metadata ${isUpdating ? "updated" : "created"} successfully!`,
      "success"
    );
    documentModal.modal("hide");
    await loadDocuments(searchInput.val().trim() || ""); // Refresh list respecting search
  } catch (error) {
    console.error(`Error ${modeLabel} document:`, error);
    Swal.fire(
      "Error",
      `Failed to ${modeLabel} document metadata. ${
        error.response?.data?.message || ""
      }`,
      "error"
    );
    saveDocumentBtn.prop("disabled", false).html("Save Document"); // Re-enable button on error
  }
}

// Handle the Replace Upload Button Click
async function handleReplaceUpload(docId) {
  if (!docId) return;

  try {
    // Create a hidden file input element dynamically
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    // fileInput.accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"; // Example: Limit accepted types
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // Listener for file selection
    fileInput.addEventListener("change", async function () {
      if (!fileInput.files || fileInput.files.length === 0) {
        document.body.removeChild(fileInput); // Clean up if no file selected
        return;
      }
      const selectedFile = fileInput.files[0];

      // Show loading indicator (optional)
      const $uploadBtn = $(`.replace-doc-btn[data-doc-id="${docId}"]`);
      const originalIcon = $uploadBtn.html();
      $uploadBtn
        .prop("disabled", true)
        .html('<i class="fas fa-spinner fa-spin"></i>');

      try {
        // Upload file using your API service
        const uploadResponse = await FileApi.uploadOfficalFile(selectedFile);

        if (!uploadResponse || !uploadResponse.filename) {
          throw new Error("Upload response did not contain a filename.");
        }

        // Update the document record with the new path
        const docUpdateData = { document_path: uploadResponse.filename };
        await DocumentApi.updateTask(docId, docUpdateData); // Update only the path

        Swal.fire("Success!", "File uploaded successfully.", "success");
        await loadDocuments(searchInput.val().trim() || ""); // Refresh list
      } catch (uploadError) {
        console.error("File upload failed:", uploadError);
        Swal.fire(
          "Upload Failed",
          `Could not upload file. ${uploadError.message || ""}`,
          "error"
        );
      } finally {
        document.body.removeChild(fileInput); // Cleanup the input element
        $uploadBtn.prop("disabled", false).html(originalIcon); // Restore button
      }
    });

    // Trigger the file selection dialog
    fileInput.click();
  } catch (error) {
    console.error("Error setting up file input:", error);
    Swal.fire("Error", "Could not initiate file upload.", "error");
  }
}

// --- Event Listeners Setup ---
$(document).ready(function () {
  // Initial Load
  loadDocuments();
  showPlaceholder(); // Ensure placeholder is shown initially

  // Search Functionality
  searchBtn.on("click", function () {
    loadDocuments(searchInput.val().trim());
  });
  searchInput.on("keypress", function (e) {
    if (e.which === 13) {
      // Enter key
      loadDocuments(searchInput.val().trim());
    }
  });

  // Preview via Row Click
  tableBody.on("click", "tr", function () {
    const row = $(this);
    const docPath = row.data("doc-path"); // Get path from data attribute

    if (!row.find("td[colspan]").length) {
      // Ignore clicking placeholder rows
      // Highlight row
      tableBody.find("tr").removeClass("table-active");
      row.addClass("table-active");

      if (docPath) {
        showPreview(docPath);
      } else {
        showPlaceholder(
          '<span class="text-warning">No preview available (no path).</span>'
        );
      }
    }
  });

  // Preview via explicit View button
  tableBody.on("click", ".view-doc-btn", function (e) {
    e.stopPropagation(); // Prevent row click event
    const path = $(this).data("doc-path");
    // Highlight parent row
    const row = $(this).closest("tr");
    tableBody.find("tr").removeClass("table-active");
    row.addClass("table-active");
    // Show preview
    showPreview(path);
  });

  // Modal Setup on Show (Handles both Add and Edit)
  documentModal.on("show.bs.modal", handleModalOpen);

  // Form Submission
  documentForm.on("submit", handleFormSubmit);

  // Replace Upload Button Click
  tableBody.on("click", ".replace-doc-btn", function (e) {
    e.stopPropagation(); // Prevent row click event
    const id = $(this).data("doc-id");
    handleReplaceUpload(id);
  });

  // Edit Button Click (Handled by modal's show.bs.modal via data attributes)
  // No separate listener needed here if data-toggle/target are set correctly

  // Add Document Button Click (Handled by modal's show.bs.modal via data attributes)
  // No separate listener needed here

  // Delete Button Click Listener (Example)
  /*
     tableBody.on("click", ".delete-doc-btn", async function (e) {
        e.stopPropagation(); // Prevent row click event
        const docId = $(this).data("doc-id");
        const docName = $(this).closest('tr').find('td:nth-child(2)').text(); // Get name for confirmation

        const result = await Swal.fire({
            title: `Delete ${docName}?`,
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
             try {
                 await DocumentApi.deleteTask(docId); // Assumes deleteTask exists
                 Swal.fire('Deleted!', 'The document has been deleted.', 'success');
                 await loadDocuments(searchInput.val().trim() || ""); // Refresh list
             } catch (error) {
                  console.error(`Error deleting document ${docId}:`, error);
                  Swal.fire('Error', `Could not delete document. ${error.response?.data?.message || ''}`, 'error');
             }
        }
     });
     */
}); // End document ready
