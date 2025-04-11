/**
 * @file authorize.js
 * @description Handles user login functionality.
 */

import * as UserEmployeeViewApi from "./services/userEmployeeViewServices.js";
import * as UserApi from "./services/userServices.js";
import * as AccessProvisioninViewgApi from "./services/accessViewServices.js";

import { isEqualIgnoreCase } from "./utils/stringUtils.js";

// --- Constants ---
const HR_ROLE = "hr";
const IT_ROLE = "it";
const EMPLOYEE_ROLE = "employee";

// --- DOM Element Caching ---
const domElements = {
  loginForm: "#loginForm",
  usernameInput: "#username",
  passwordInput: "#password",
  togglePasswordIcon: "#togglePasswordIcon",
};

// --- Utility Functions ---

/**
 * @function showError
 * @description Displays an error message using SweetAlert2.
 * @param {string} message - The error message to display.
 */
function showError(message) {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
}

/**
 * @function showSuccess
 * @description Displays a success message using SweetAlert2.
 * @param {string} message - The success message to display.
 */
function showSuccess(message) {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
  });
}

/**
 * @function handleLogin
 * @description Handles the login process.
 */
async function handleLogin() {
  try {
    const username = $(domElements.usernameInput).val();
    const password = $(domElements.passwordInput).val();

    // Validate input
    if (!username || !password) {
      showError("Please enter both username and password.");
      return;
    }

    // Fetch user by username
    const user = await UserApi.getTaskByName(username);
    if (!user) {
      showError("User not found.");
      return;
    }

    // Verify password
    if (user.password !== password) {
      showError("Password is incorrect.");
      return;
    }

    // Fetch user view
    const userView = await UserEmployeeViewApi.getUserEmployeeByUserId(
      user.user_id
    );

    // Check if user is active
    const isActive = userView.u_is_active == "1";
    if (!isActive) {
      window.location.href = "/unauth";
      return;
    }

    // Fetch user access
    const userAccess = await AccessProvisioninViewgApi.getUserAccessByUserId(
      user.user_id
    );
    const activeAserAccess = userAccess.filter((x) => x.enabled == 1);

    // Store user data in session storage
    sessionStorage.setItem("user", JSON.stringify(userView));
    sessionStorage.setItem("user-auth", JSON.stringify(activeAserAccess));

    showSuccess("Login successful!");

    // Redirect based on user role
    let redirectURL = "/dashboard-employee"; // Default redirect
    if (isEqualIgnoreCase(userView.user_role, HR_ROLE)) {
      redirectURL = "/dashboard-hr";
    } else if (isEqualIgnoreCase(userView.user_role, IT_ROLE)) {
      redirectURL = "/dashboard-it";
    }

    window.location.href = redirectURL;
  } catch (error) {
    console.error("Login failed:", error);
    showError("Login failed. Please try again.");
  }
}

/**
 * @function setupEventListeners
 * @description Sets up event listeners for the login form.
 */
function setupEventListeners() {
  $(domElements.loginForm).on("submit", function (event) {
    event.preventDefault();
    handleLogin();
  });
}

/**
 * @function initializePage
 * @description Initializes the login page by setting up event listeners.
 */
function initializePage() {
  setupEventListeners();
}

// --- Document Ready ---
$(document).ready(initializePage);
