const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import database connection

const TrainingModule = sequelize.define('TrainingModule', {
  trainning_module_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  trainning_module_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  trainning_module_description: {
    type: DataTypes.STRING(145),
    allowNull: true,
  },
  trainning_department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'b_trainning_modules',
  timestamps: false, // Disable createdAt & updatedAt fields if not needed
});

module.exports = TrainingModule;
