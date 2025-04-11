const { QueryTypes } = require("sequelize");
const db = require("../config/database"); // Ensure your database connection is imported

class FormDesignViewRepository {
  async getAllFormDesign() {
    try {
      const rows = await db.query("SELECT * FROM v_form_design", {
        type: QueryTypes.SELECT, // Specify query type
      });
      return rows;
    } catch (error) {
      console.error("Error fetching all user employees:", error);
      throw error;
    }
  }

  async getFormDesignByFormId(formId) {
    try {
      const rows = await db.query("SELECT * FROM v_form_design where form_id = :formId", {
        replacements: { formId },
        type: QueryTypes.SELECT,
      });
      return rows;
    } catch (error) {
      console.error(
        `Error fetching user employee for user ID ${formId}:`,
        error
      );
      throw error;
    }
  }

  async getFormDesignFormTypeByFormTypeId() {
    try {
      const rows = await db.query(
        "SELECT  distinct form_id, form_name FROM v_form_design",
        {
          type: QueryTypes.SELECT, // Specify query type
        }
      );
      return rows;
    } catch (error) {
      console.error(`Error fetching user employee for user ID`, error);
      throw error;
    }
  }
}

module.exports = new FormDesignViewRepository();
