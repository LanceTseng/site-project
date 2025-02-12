const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure database config is set up

const ParentTask = sequelize.define('ParentTask', {
  task_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  task_name: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  task_description: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  task_group_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enabled: {
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 1,
  },
}, {
  tableName: 'b_parent_tasks',
  timestamps: true,
  createdAt: "created_date",
  updatedAt: "last_updated_date"
});

module.exports = ParentTask;
