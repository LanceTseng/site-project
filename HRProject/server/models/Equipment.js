const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure this points to your Sequelize instance

const Equipment = sequelize.define(
  "Equipment",
  {
    equipment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipment_name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    equipment_type_id: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    equipment_code: {
      type: DataTypes.STRING(45),
      unique: true,
      allowNull: true,
    },
    occupied: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
  },
  {
    tableName: "b_equipments",
    timestamps: false,
  }
);

module.exports = Equipment;
