const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure your database config is set up

const Document = sequelize.define('Document', {
  document_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  document_name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  document_path: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  require_upload: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 1
  },
}, {
  tableName: 'b_documents',
  timestamps: false, // If you don’t have `createdAt` and `updatedAt` columns
});

module.exports = Document;
