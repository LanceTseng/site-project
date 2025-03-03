const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TicketDetail = sequelize.define(
  "TicketDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticket_head_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    response: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reponse_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "b_ticket_detail",
    timestamps: true,
    createdAt:"created_date",
    updatedAt:"created_date"
  }
);

module.exports = TicketDetail;
