const FormDesign = require("../models/FormDesign");

class FormDesignRepository {
  async getAll() {
    return await FormDesign.findAll();
  }

  async getById(id) {
    //question id => PK
    return await FormDesign.findByPk(id);
  }

  async getByFormId(id) {
    //form id
    return await FormDesign.findAll({ where: { form_id: id } });
  }

  async create(data) {
    return await FormDesign.create(data);
  }

  async update(id, data) {
    await FormRepository.update(data, { where: { id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await FormDesign.destroy({ where: { id: id } });
  }
}

module.exports = new FormDesignRepository();
