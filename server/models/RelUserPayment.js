const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure this path is correct

const RelUserParentTask = sequelize.define(
  "RelUserPayment",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    payment_type_id: { type: DataTypes.INTEGER, allowNull: false },
    annual_pay: { type: DataTypes.DOUBLE, allowNull: false },
    work_hours_per_week: { type: DataTypes.DOUBLE, allowNull: false },
    terminal_pay: { type: DataTypes.DOUBLE, allowNull: true },
  },
  {
    tableName: "rel_user_payment",
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "last_updated_date", // Disable timestamps since we are using custom create_date and last_updated_date
  }
);

module.exports = RelUserParentTask;
