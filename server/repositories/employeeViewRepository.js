const db = require('../config/database'); // Ensure your database connection is imported

class EmployeeViewRepository {
  async getAllEmployees() {
    try {
      const [rows] = await db.query("SELECT * FROM v_employees");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeById(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM v_employees WHERE employee_id = ?",
        [id]
      );
      return rows.length > 0 ? rows[0] : null; // Return first row or null if not found
    } catch (error) {
      throw error;
    }
  }
}

// Export an instance of the class
module.exports = new EmployeeViewRepository();
