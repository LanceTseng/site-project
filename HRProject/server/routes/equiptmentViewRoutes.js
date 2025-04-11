const express = require('express');
const EquipmentViewController = require('../controllers/equiptmentViewController');

const router = express.Router();

router.get('/equipmentview', EquipmentViewController.getAllEpuipmentView);
router.get('/equipmentview/userid/:userid', EquipmentViewController.getEpuipmentViewByUserId);
router.get('/equipmentview/eqptid/:eqptid', EquipmentViewController.getEpuipmentViewByEqptId); // Get by name
router.get('/equipmentview/eqptname/:eqptname', EquipmentViewController.getEpuipmentViewByEqptName);
router.get('/equipmentview/status/:status', EquipmentViewController.getEpuipmentViewByStatus);

router.get('/eqptoccupiedview/userid/:userid', EquipmentViewController.getEqptOccupiedViewByUserId);
router.get('/eqptoccupiedview/eqptid/:eqptid', EquipmentViewController.getEqptOccupiedViewByEqptId); // Get by name

module.exports = router;
