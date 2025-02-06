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
    allowNull: false,
  },
  require_upload: {
    type: DataTypes.TINYINT,
    allowNull: false,
  },
}, {
  tableName: 'b_documents',
  timestamps: false, // If you don’t have `createdAt` and `updatedAt` columns
});

module.exports = Document;
