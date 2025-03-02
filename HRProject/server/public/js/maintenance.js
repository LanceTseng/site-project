import { accessVerify } from "./utils/authVerify.js";

$(document).ready(function () {
  // When a card is clicked, redirect to the page specified in the 'data-link' attribute
  $(".card").on("click", function () {
    const cardTitle = $(this).find(".card-title").text().trim();
    if (!accessVerify(cardTitle)) {
      Swal.fire("Error", `Access Denied. Please contact IT.`, "error");
      return;
    }

    const link = $(this).data("link");
    window.location.href = link;
  });

  // Optional: Make sure the card links are properly clicked on 'Go to' button
  $(".custom-btn").on("click", function (e) {
    e.stopPropagation(); // Prevent the card click from being triggered
    e.preventDefault();
    // Get the card title of the clicked button's card
    const cardTitle = $(this)
      .closest(".card")
      .find(".card-title")
      .text()
      .trim();
    if (!accessVerify(cardTitle)) {
      Swal.fire("Error", `Access Denied. Please contact IT.`, "error");
      return;
    }
    const link = $(this).closest(".card").data("link");
    window.location.href = link;
  });
});
