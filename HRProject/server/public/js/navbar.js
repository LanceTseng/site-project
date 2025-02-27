import { isEqualIgnoreCase } from "./utils/stringUtils.js";

function setUpDashboard(role) {
  var dashboardLink = $("#nav-dashboard a");
  if (isEqualIgnoreCase(role, "hr")) {
    dashboardLink.attr("href", "/dashboard-hr");
  } else if (isEqualIgnoreCase(role, "it")) {
    dashboardLink.attr("href", "/dashboard-it");
  } else {
    dashboardLink.attr("href", "/dashboard-employee");
  }
} 

function setUpNavBrand(role){
    var navBrand = $(".navbar-brand");
    if (isEqualIgnoreCase(role, "hr")) {
        navBrand.attr("href", "/dashboard-hr");
      } else if (isEqualIgnoreCase(role, "it")) {
        navBrand.attr("href", "/dashboard-it");
      } else {
        navBrand.attr("href", "/dashboard-employee");
      }
}

function initialNavgator() {
  var user = JSON.parse(sessionStorage.getItem("user"));

  console.log(user);

  const btnLogin = $("#nav-login");
  const btnLogout = $("#nav-logout");
  const dashboard = $("#nav-dashboard");
  const report = $("#nav-report").hide();
  const maintenance = $("#nav-maintenance");

  btnLogin.hide();
  btnLogout.hide();
  dashboard.hide();
  report.hide();
  maintenance.hide();

  //login
  if (user) {
    btnLogout.show();
    setUpDashboard(user.user_role);
    setUpNavBrand(user.user_role);
    report.show();
    if (isEqualIgnoreCase(user.user_role, "hr")) {
      maintenance.show();
    }
    if (isEqualIgnoreCase(user.user_role, "it")) {
      maintenance.show();
    }
  } else {
    btnLogin.show();
  }
}

function handleLogout() {
  sessionStorage.removeItem("user");
  window.location.href = "/logout";
}

$(document).ready(function () {
  initialNavgator();

  $("#nav-logout").click(function () {
    handleLogout();
  });
});
