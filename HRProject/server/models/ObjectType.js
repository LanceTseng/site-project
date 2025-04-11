const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ObjectType = sequelize.define(
  'ObjectType',
  {
    object_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    object_type_name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    object_type_item_key: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    object_type_item_value: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    object_sequence: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: 'b_object_type',
    timestamps: false,
  }
);

module.exports = ObjectType;
