const express = require('express');
const AccessProvisioningController = require('../controllers/accessProvisioningController');

const router = express.Router();

router.get('/access-provisioning', AccessProvisioningController.getAll);
router.get('/access-provisioning/:id', AccessProvisioningController.getById);
router.get('/access-provisioning/name/:name', AccessProvisioningController.getByName); // Get by name
router.post('/access-provisioning', AccessProvisioningController.create);
router.put('/access-provisioning/:id', AccessProvisioningController.update);
router.delete('/access-provisioning/:id', AccessProvisioningController.delete);

module.exports = router;
