import { employees, object_type } from "./mockdata.js";

$(document).ready(function () {
  // Function to populate employee dropdown with name and department
  function populateEmployeeDropdown() {
    const employeeOptions = employees
      .filter(emp => emp.status === "Active")  // Filter active employees
      .map((emp) => {
        // Find the department for each employee
        const department = object_type.find((dept) => dept.object_type === emp.department_id)?.object_type || "Unknown";
        return `<option value="${emp.id}">${emp.first_name} ${emp.last_name} - ${department}</option>`;
      })
      .join("");
    
    $("#employee").html(employeeOptions);
  }

  // Call the function to populate employee dropdown when the page is ready
  populateEmployeeDropdown();

  // Handle the form submission
  $("#offboarding-form").on("submit", function (e) {
    e.preventDefault();

    const employeeId = $("#employee").val();
    const offboardingDate = $("#offboarding-date").val();

    // Find the employee by ID
    const employee = employees.find((emp) => emp.id == employeeId);

    if (employee) {
      // Process offboarding (you can implement actual logic here)
      console.log(`Offboarding Employee: ${employee.first_name} ${employee.last_name}`);
      console.log(`Offboarding Date: ${offboardingDate}`);

      // Reset the form after submission
      this.reset();
    }
  });
});
