const express = require('express');
const EmployeeViewController = require('../controllers/employeeViewController');

const router = express.Router();

router.get('/employeeview', EmployeeViewController.getAllEmployeeView);
router.get('/employeeview/:id', EmployeeViewController.getEmployeeViewById); 

module.exports = router;
