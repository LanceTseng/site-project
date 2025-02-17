const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust path based on your setup

const FormDesign = sequelize.define(
  "FormDesign",
  {
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    form_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    form_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    form_question_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    form_question_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    form_question_display: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
  },
  {
    tableName: "b_form_design",
    timestamps: false, // Set to true if you have createdAt & updatedAt columns
  }
);

module.exports = FormDesign;
