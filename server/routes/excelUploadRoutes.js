const express = require('express');
const ExcelUploadController = require('../controllers/excelUploadController');

const router = express.Router();

router.post('/upload-file-excel', ExcelUploadController.createData);
router.get('/upload-file-excel', ExcelUploadController.getAllData);
 

module.exports = router;
