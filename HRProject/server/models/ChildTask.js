const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ChildTask = sequelize.define(
  "ChildTask",
  {
    child_task_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parent_task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    child_task_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    child_task_description: {
      type: DataTypes.STRING(145),
      allowNull: true,
    },
    document_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    training_module_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    equipment_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    access_provisioning_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    interview_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    survey_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    hand_over_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    enabled: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
  },
  {
    tableName: "b_child_tasks",
    timestamps: false,
  }
);

module.exports = ChildTask;
