const express = require('express');
const EquipmentController = require('../controllers/equipmentController');

const router = express.Router();

router.get('/equipments', EquipmentController.getAll);
router.get('/equipments/:id', EquipmentController.getById);
router.get('/equipments/name/:name', EquipmentController.getByName); // Get by name
router.post('/equipments', EquipmentController.create);
router.put('/equipments/:id', EquipmentController.update);
router.delete('/equipments/:id', EquipmentController.delete);

module.exports = router;
