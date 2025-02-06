const express = require('express');
const EmployeeController = require('../controllers/employeeController');

const router = express.Router();

router.get('/employees', EmployeeController.getAll);
router.get('/employees/:id', EmployeeController.getById);
router.get('/employees/search', EmployeeController.getByName); // New route for name search
router.post('/employees', EmployeeController.create);
router.put('/employees/:id', EmployeeController.update);
router.delete('/employees/:id', EmployeeController.delete);

module.exports = router;
