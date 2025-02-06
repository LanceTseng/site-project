const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AccessProvisioning = sequelize.define('AccessProvisioning', {
  access_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  access_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  access_description: {
    type: DataTypes.STRING(145),
    allowNull: true,
  },
  access_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  access_role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'b_access_provisioning',
  timestamps: false,
});

module.exports = AccessProvisioning;
