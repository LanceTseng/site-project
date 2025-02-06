const AccessProvisioning = require('../models/AccessProvisioning');

class AccessProvisioningRepository {
  async getAll() {
    return await AccessProvisioning.findAll();
  }

  async getById(id) {
    return await AccessProvisioning.findByPk(id);
  }

  async getByName(name) {
    return await AccessProvisioning.findOne({
      where: { access_name: name }
    });
  }

  async create(accessData) {
    return await AccessProvisioning.create(accessData);
  }

  async update(id, accessData) {
    await AccessProvisioning.update(accessData, { where: { access_id: id } });
    return this.getById(id);
  }

  async delete(id) {
    return await AccessProvisioning.destroy({ where: { access_id: id } });
  }
}

module.exports = new AccessProvisioningRepository();
