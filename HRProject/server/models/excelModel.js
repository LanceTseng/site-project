const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Excefile = sequelize.define(
  "Excefile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    tableName: "excefile",
    timestamps: false,
  }
);

module.exports = Excefile;
