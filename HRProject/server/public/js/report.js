import { accessVerify } from "./utils/authVerify.js";

const cardData = [
  {
    title: "User Task",
    icon: "fa-tasks",
    color: "text-secondary",
    link: "/report-user-task",
  },
  {
    title: "Profile",
    icon: "fa-id-card",
    color: "text-secondary",
    link: "/report-profile",
  },
  {
    title: "Document",
    icon: "fa-file-alt",
    color: "text-secondary",
    link: "document.html",
  },
  {
    title: "Training",
    icon: "fa-chalkboard-teacher",
    color: "text-secondary",
    link: "/report-training",
  },
  // {
  //   title: "Goals",
  //   icon: "fa-bullseye",
  //   color: "text-secondary",
  //   link: "/report-goal",
  // },
  {
    title: "Ticket Request",
    icon: "fa-ticket",
    color: "text-secondary",
    link: "/report-ticket",
  },
  {
    title: "Payment",
    icon: "fa-money-bill-1-wave",
    color: "text-secondary",
    link: "/report-payment",
  },
];

function renderCardMenu() {
  const container = $(".row.g-4"); // Target the row container

  cardData.forEach((card) => {
    const cardHTML = `
      <div class="col-md-4 animate__animated animate__backInDown">
        <div class="card menu-card" data-link="${card.link}">
          <div class="card-body text-center">
            <i class="fa-solid ${card.icon} ${card.color} fa-3x mb-3"></i>
            <h5 class="card-title">${card.title}</h5>
            <a href="#" class="btn btn-outline-secondary custom-btn">Go to ${card.title}</a>
          </div>
        </div>
      </div>
    `;

    container.append(cardHTML);
  });
}

$(document).ready(function () {
  renderCardMenu();

  $(".menu-card").click(function () {
    const cardTitle = $(this).find(".card-title").text().trim();
    if (!accessVerify(cardTitle)) {
      Swal.fire("Error", `Access Denied. Please contact IT.`, "error");
      return;
    }

    const link = $(this).data("link");
    if (link) {
      window.location.href = link;
    }
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
