const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class TrainingModuleViewRepository {
  async geTrainingModuleViewByCondition(name, department, status) {
    try {
      let query = "SELECT * FROM v_training_modules WHERE 1=1";
      const replacements = {};

      if (name) {
        query +=
          " AND training_module_name LIKE :name OR employee_last_name LIKE :name";
        replacements.name = `%${name}%`;
      }
      if (department) {
        query += " AND training_department_id = :department";
        replacements.department = department;
      }
      if (status) {
        query += " AND enabled = :status";
        replacements.status = status;
      }

      const userPayments = await db.query(query, {
        type: QueryTypes.SELECT,
        replacements: replacements,
      });
      return userPayments;
    } catch (error) {
      console.error("Error fetching user payments by condition: ", error);
      throw error;
    }
  }
}

module.exports = new TrainingModuleViewRepository();
