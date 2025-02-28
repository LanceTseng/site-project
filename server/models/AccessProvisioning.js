const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust path as needed

const AccessProvisioning = sequelize.define(
  "AccessProvisioning",
  {
    access_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    access_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    access_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    access_description: {
      type: DataTypes.STRING(145),
      allowNull: true,
    },
    access_role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1, // Assuming 1 means enabled
    },
  },
  {
    tableName: "b_access_provisioning",
    timestamps: false, // Set to true if you have createdAt/updatedAt columns
  }
);

module.exports = AccessProvisioning;
