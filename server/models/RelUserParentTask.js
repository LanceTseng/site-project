const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure this path is correct

const RelUserParentTask = sequelize.define(
  "RelUserParentTask",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    count_child_tasks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    create_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    last_updated_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "rel_user_parenttask",
    timestamps: false, // Disable timestamps since we are using custom create_date and last_updated_date
  }
);

module.exports = RelUserParentTask;
