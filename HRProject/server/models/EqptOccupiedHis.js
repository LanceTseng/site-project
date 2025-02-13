const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure correct path to DB config

const EquipmentOccupiedHistory = sequelize.define(
  "EqptOccupiedHis",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    equipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    occupied_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    occupied_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    released_date: {
      type: DataTypes.DATE,
      allowNull: true, // Allow null in case it's not released yet
    },
    occupied_task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    released_task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "b_eqpt_occupied_his",
    timestamps: false, // If your table doesn't have createdAt and updatedAt
  }
);
module.exports = EquipmentOccupiedHistory;

