// excelUploadController.js
const Excelfile = require("../models/excelModel");

const createData = async (req, res) => {
  try {
    const { username, email } = req.body;
    const data = await Excelfile.create({ username, email });
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Failed to create document" });
  }
};

const getAllData = async (req, res) => {
  try {
    const data = await Excelfile.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
};

module.exports = {
  createData,
  getAllData,
};
