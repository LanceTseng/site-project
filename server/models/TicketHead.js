const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TicketHead = sequelize.define(
  "TicketHead",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ticket_topic: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    ticket_department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "b_ticket_head",
    timestamps: true,
    createdAt: "created_date",
    updatedAt: "last_updated_date",
  }
);

module.exports = TicketHead;
