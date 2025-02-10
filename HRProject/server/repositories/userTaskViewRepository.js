const db = require("../config/database"); // Ensure your database connection is imported

class UserTaskViewRepository {
  /**
   * Get all user tasks
   */
  async getAllUserTasks() {
    try {
      const [rows] = await db.query("SELECT * FROM v_user_task");
      return rows;
    } catch (error) {
      console.error("Error fetching all user tasks:", error);
      throw error;
    }
  }

  /**
   * Get user tasks by user ID
   */
  async getUserTaskByUserId(userId) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM v_user_task WHERE user_id = ${userId}`
      );
      return rows.length > 0 ? rows[0] : null; // Return first row or null if not found
    } catch (error) {
      console.error(`Error fetching user task for user ID ${userId}:`, error);
      throw error;
    }
  }

  async getUserTaskByHeadId(id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM v_user_task WHERE head_id = ${id}`
      );

      return rows.length > 0 ? rows[0] : null; // Return first row or null if not found
    } catch (error) {
      console.error(`Error fetching user task for user ID ${id}:`, error);
      throw error;
    }
  }

  async getUserTaskByLineId(id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM v_user_task WHERE line_id = ${id}`
      );

      return rows.length > 0 ? rows[0] : null; // Return first row or null if not found
    } catch (error) {
      console.error(`Error fetching user task for user ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all parent tasks
   */
  async getAllUserParentTask() {
    try {
      const [rows] = await db.query("SELECT * FROM v_user_parent_task");
      return rows;
    } catch (error) {
      console.error("Error fetching all user parent tasks:", error);
      throw error;
    }
  }

  /**
   * Get parent tasks by user ID
   */
  async getUserParentTaskByUserId(userId) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM v_user_parent_task WHERE user_id = ${userId}`
      );
      return rows;
    } catch (error) {
      console.error(
        `Error fetching parent tasks for user ID ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get all child tasks
   */
  async getAllUserChildTask() {
    try {
      const [rows] = await db.query("SELECT * FROM v_user_child_task");
      return rows;
    } catch (error) {
      console.error("Error fetching all user child tasks:", error);
      throw error;
    }
  }

  /**
   * Get child tasks by parent task ID
   */
  async getUserChildTaskByTaskId(taskId) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM v_user_child_task WHERE user_parenttask_id = ${taskId}`
      );
      return rows;
    } catch (error) {
      console.error(
        `Error fetching child tasks for parent task ID ${taskId}:`,
        error
      );
      throw error;
    }
  }
}

// Export an instance of the class
module.exports = new UserTaskViewRepository();
