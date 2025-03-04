const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const RelUserHandover = sequelize.define(
  "RelUserHandover",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_childtask_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    handover_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    handover_note: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
  },
  {
    tableName: "rel_user_handover",
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "last_updated_date", // Disable timestamps since we are using custom create_date and last_updated_date
  }
);

module.exports = RelUserHandover;
