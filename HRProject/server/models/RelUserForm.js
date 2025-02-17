const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserForm = sequelize.define(
  "RelUserForm",
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
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    form_question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    form_question_response: {
      type: DataTypes.STRING(145),
      allowNull: false,
    },
    user_childtask_id: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "rel_user_form",
    timestamps: false, // Change to true if you want Sequelize to manage timestamps
  }
);

module.exports = UserForm;
