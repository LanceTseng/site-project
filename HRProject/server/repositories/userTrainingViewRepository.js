const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class UserTrainingViewRepository {
  async geTrainingModuleViewByCondition(
    training_name,
    user_name,
    department,
    status,
    user_childtask_id
  ) {
    try {
      let query = "SELECT * FROM v_user_training WHERE 1=1";
      const replacements = {};

      if (training_name) {
        query += " AND training_module_name LIKE :training_name";
        replacements.training_name = `%${training_name}%`;
      }
      if (user_name) {
        query += " AND user_name LIKE :user_name";
        replacements.user_name = `%${user_name}%`;
    }
      if (department) {
        query += " AND training_department_id = :department";
        replacements.department = department;
      }
      if (status) {
        query += " AND status = :status";
        replacements.status = status;
      }
      if (user_childtask_id) {
        query += " AND user_ct_line_id = :user_childtask_id";
        replacements.user_childtask_id = user_childtask_id;
      }

      const userTraining = await db.query(query, {
        type: QueryTypes.SELECT,
        replacements: replacements,
      });
      return userTraining;
    } catch (error) {
      console.error("Error fetching user payments by condition: ", error);
      throw error;
    }
  }
}

module.exports = new UserTrainingViewRepository();
