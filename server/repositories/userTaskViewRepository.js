const db = require('../config/database'); // Ensure your database connection is imported

class UserTaskViewRepository {
  async getAllUserTasks() {
    try {
      const [rows] = await db.query("SELECT * FROM v_user_task");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  async getUserTaskByUserId(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM v_user_task WHERE user_id = ?",
        [id]
      );
      return rows.length > 0 ? rows[0] : null; // Return first row or null if not found
    } catch (error) {
      throw error;
    }
  }
}

// Export an instance of the class
module.exports = new UserTaskViewRepository();
