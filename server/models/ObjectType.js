const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure you have a database config file

const ObjectType = sequelize.define('ObjectType', {
  object_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  object_type_name: {
    type: DataTypes.STRING(45),
    allowNull: true,
  }
}, {
  tableName: 'b_object_type',
  timestamps: false, // Disable createdAt and updatedAt if not needed
});

module.exports = ObjectType;
