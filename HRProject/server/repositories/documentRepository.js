const Document = require('../models/Document');

class DocumentRepository {
  async getAll() {
    return await Document.findAll();
  }

  async getById(id) {
    return await Document.findByPk(id);
  }

  async getByName(name) {
    return await Document.findOne({ where: { document_name: name } });
  }

  async create(documentData) {
    return await Document.create(documentData);
  }

  async update(id, documentData) {
    await Document.update(documentData, { where: { document_id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await Document.destroy({ where: { document_id: id } });
  }
}

module.exports = new DocumentRepository();
