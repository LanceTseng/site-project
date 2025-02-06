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
  created_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  last_updated_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'b_parent_tasks',
  timestamps: false
});

module.exports = ParentTask;
