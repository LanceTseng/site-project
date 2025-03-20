const express = require('express');
 
const router = express.Router();

router.post('/upload-file-excel', (req, res)=>{
    const excelData = req.body;

    if (!excelData || !excelData.length) {
        return res.status(400).json({ error: "No data received" });
    }

    console.log("Received Excel Data:", excelData);

    // Process the data (save to DB, perform validation, etc.)
    
    res.json({ message: "Excel data received successfully!", data: excelData });
});

module.exports = router;
