const RelUserAccess = require("../models/RelUserAccess");

class RelUserAccessRepository {
  async getAll() {
    return await RelUserAccess.findAll();
  }

  async getById(userId, accessId) {
    return await RelUserAccess.findOne({
      where: { user_id: userId, access_id: accessId },
    });
  }

  async getByUserId(userId) {
    return await RelUserAccess.findOne({
      where: { user_id: userId },
    });
  }

  async create(accessData) {
    return await RelUserAccess.create(accessData);
  }

  async update(userId, accessId, accessData) {
    await RelUserAccess.update(accessData, {
      where: { user_id: userId, access_id: accessId },
    });
    return this.getById(userId, accessId); // Fetch updated record
  }

  async delete(userId, accessId) {
    return await RelUserAccess.destroy({
      where: { user_id: userId, access_id: accessId },
    });
  }
}

module.exports = new RelUserAccessRepository();
