const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure correct path to DB config

const Employee = sequelize.define(
  "Employee",
  {
    employee_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    link_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "b_employees",
    timestamps: false, // Since we handle timestamps manually
  }
);

module.exports = Employee;
