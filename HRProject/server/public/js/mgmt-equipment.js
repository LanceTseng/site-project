import { equiptmets } from "./mockdata2.js";
import { users, object_type } from "./mockdata.js";

$(document).ready(function () {
  function loadTable(data) {
    const rows = data
      .map(
        (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.equiptmet_name}</td>
          <td>${
            object_type.find((x) => x.id == item.equiptmet_type_id)
              ?.object_type || ""
          }</td>
          <td>${
            users.find((u) => u.id == item.equiptment_assigned_to)?.username ||
            ""
          }</td>
          <td>${item.equiptment_occupied ? "Yes" : "No"}</td>
          <td>
            <button class="btn btn-warning btn-sm edit-btn" data-id="${
              item.id
            }">
              Edit
            </button>
          </td>
        </tr>
      `
      )
      .join("");
    $("#equipment-table-body").html(rows);
  }

  loadTable(equiptmets);

  // Search functionality
  $("#search-field").on("input", function () {
    const query = $(this).val().toLowerCase();
    const filtered = equiptmets.filter((item) =>
      item.equiptmet_name.toLowerCase().includes(query)
    );
    loadTable(filtered);
  });

  // Edit modal
  $("#equipment-table-body").on("click", ".edit-btn", function () {
    const id = $(this).data("id");
    const equipment = equiptmets.find((item) => item.id === id);
    $("#edit-id").val(equipment.id);
    $("#edit-name").val(equipment.equiptmet_name);
    $("#edit-assigned-to").val(equipment.equiptment_assigned_to);
    $("#edit-occupied").val(equipment.equiptment_occupied);
    $("#edit-modal").modal("show");
  });

  $("#edit-form").on("submit", function (e) {
    e.preventDefault();
    const id = parseInt($("#edit-id").val());
    const index = equiptmets.findIndex((item) => item.id === id);
    if (index !== -1) {
      equiptmets[index] = {
        ...equiptmets[index],
        equiptmet_name: $("#edit-name").val(),
        equiptment_assigned_to: parseInt($("#edit-assigned-to").val()) || 0,
        equiptment_occupied: $("#edit-occupied").val() === "true",
      };
      loadTable(equiptmets);
    }
    $("#edit-modal").modal("hide");
  });

  // Open Add Modal
  $("#new-equipment-btn").on("click", function () {
    $("#new-equipment-form")[0].reset();
    $("#new-equipment-modal").modal("show");
  });

  // Add new equipment
  $("#new-equipment-form").on("submit", function (e) {
    e.preventDefault();
    const newEquipment = {
      id: equiptmets.length + 1,
      equiptmet_name: $("#new-name").val(),
      equiptmet_type_id: parseInt($("#new-type").val()) || 0,
      equiptment_assigned_to: parseInt($("#new-assigned-to").val()) || 0,
      equiptment_occupied: $("#new-occupied").val() === "true",
    };
    equiptmets.push(newEquipment);
    loadTable(equiptmets);
    $("#new-equipment-modal").modal("hide");
  });
});
