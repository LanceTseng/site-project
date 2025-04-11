const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Import database connection

const TrainingModule = sequelize.define(
  "TrainingModule",
  {
    training_module_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    training_module_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    training_module_description: {
      type: DataTypes.STRING(145),
      allowNull: true,
    },
    training_department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
  },
  {
    tableName: "b_training_modules",
    timestamps: false, // Disable createdAt & updatedAt fields if not needed
  }
);

module.exports = TrainingModule;
