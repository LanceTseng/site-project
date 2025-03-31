import { accessVerify } from "./utils/authVerify.js";

document.addEventListener("DOMContentLoaded", () => {
  const menuContainer = document.getElementById("menu-container");

  // Define menu items dynamically
  const menuItems = [
    { title: "Task Management", icon: "fas fa-tasks", description: "Manage tasks for maintenance activities.", link: "/mgmt-task" },
    { title: "Equipment Management", icon: "fas fa-tools", description: "View and manage maintenance equipment.", link: "/mgmt-equipment" },
    { title: "HRIS Management", icon: "fas fa-user-cog", description: "Manage users and employees.", link: "/mgmt-user-employee" },
    { title: "Document Management", icon: "fas fa-file-alt", description: "View and manage maintenance documents.", link: "/mgmt-document" },
    { title: "Training Management", icon: "fas fa-chalkboard-teacher", description: "Access and manage training modules.", link: "/mgmt-training-module" },
    { title: "Access Provisioning Management", icon: "fas fa-universal-access", description: "Access provisioning modules.", link: "/mgmt-access" },
    { title: "User Access Management", icon: "fas fa-user-check", description: "User Access modules.", link: "/mgmt-user-access" }
];

  // Generate the menu dynamically
  menuItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "col-md-4";
    card.innerHTML = `
            <div class="card p-4 text-center" data-link="${item.link}">
                <i class="${item.icon}"></i>
                <h5 class="card-title mt-3">${item.title}</h5>
                <p class="card-text">${item.description}</p>
                <button class="custom-btn mt-auto">Go to ${item.title}</button>
            </div>
        `;
    menuContainer.appendChild(card);
  });

  // Add event listeners for access verification
  $(document).ready(function () {
    // Card click event
    $(".card").on("click", function () {
      const cardTitle = $(this).find(".card-title").text().trim();
      if (!accessVerify(cardTitle)) {
        Swal.fire("Error", "Access Denied. Please contact IT.", "error");
        return;
      }
      const link = $(this).data("link");
      window.location.href = link;
    });

    // Button click event (prevents card click event)
    $(".custom-btn").on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      const cardTitle = $(this)
        .closest(".card")
        .find(".card-title")
        .text()
        .trim();
      if (!accessVerify(cardTitle)) {
        Swal.fire("Error", "Access Denied. Please contact IT.", "error");
        return;
      }
      const link = $(this).closest(".card").data("link");
      window.location.href = link;
    });
  });
});
