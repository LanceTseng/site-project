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
      type: DataTypes.STRING(255), // Increased length for better flexibility
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20), // Phone numbers shouldn't be too long
      allowNull: true,
    },
    is_active: {
      type: DataTypes.SMALLINT, // Boolean instead of TINYINT
      allowNull: false,
      defaultValue: 1,
    },
    onboard_date: {
      type: DataTypes.DATE, // Fixed incorrect DataType
      allowNull: true,
    },
    offboard_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    link_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    } 
  },
  {
    tableName: "b_employees",
    timestamps: true,
    createdAt:"created_date",
    updatedAt:"last_updated_date" // Manually handling timestamps
  }
);

module.exports = Employee;
