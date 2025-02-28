const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust path as needed

const RelUserAccess = sequelize.define(
  "RelUserAccess",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    access_id: {
      type: DataTypes.STRING(45),
      primaryKey: true,
    },
    enabled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1, // Assuming 1 means enabled
    },
    
  },
  {
    tableName: "rel_user_access",
    timestamps: true,
    createdAt:"created_date",
    updatedAt:"last_updated_date" // Set to true if using Sequelize's createdAt/updatedAt
  }
);

module.exports = RelUserAccess;
