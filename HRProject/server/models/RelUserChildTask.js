const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import your Sequelize instance

const RelUserChildTask = sequelize.define('RelUserChildTask', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_parenttask_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_childtask_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  document_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  document_path: {
    type: DataTypes.STRING(145),
    allowNull: true
  },
  trainning_module_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  equipment_type_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  equipment_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  acess_provisioning_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  interview_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  survey_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  hand_over_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  } 
}, {
  tableName: 'rel_user_childtask',
  timestamps: true,
  createdAt:'created_date',
  updatedAt:'last_updated_date'
  
});

module.exports = RelUserChildTask;
