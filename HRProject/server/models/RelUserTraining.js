const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Ensure this path is correct

const RelUserTraining = sequelize.define(
  "RelUserTraining",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    training_module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    verified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    link_user_childtask_id:{
        type: DataTypes.INTEGER,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "rel_user_training",
    createdAt: "created_date",
    updatedAt: "updated_date",
  }
);

module.exports = RelUserTraining;
