const express = require("express");
const path = require("path");
const router = express.Router();
const upload = require("../middlewares/multerConfig");

// File Upload Endpoint
router.post("/upload-user-file", upload.uploadUserFile.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

router.post("/upload-offical-file", upload.uploadOfficalFile.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

router.get("/files/:filename", (req, res) => {
  console.log("In");
  const filePath = path.join(__dirname, "../files", req.params.filename);

  // Check if file exists before sending
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error retrieving file:", err);
      res.status(404).json({ error: "File not found" });
    }
  });
});

router.get("/files/offical/:filename", (req, res) => {
  console.log("In");

  const filePath = path.join(
    __dirname,
    "../files/offical",
    req.params.filename
  );

  // Check if file exists before sending
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error retrieving file:", err);
      res.status(404).json({ error: "File not found" });
    }
  });
});

router.get("/fileurl/:filename?", (req, res) => {
  if (!req.params.filename) return res.status(200).json({ fileurl: "" });

  const filePath = `${process.env.BASE_URL}api/files/${req.params.filename}`;

  res.status(200).json({ fileurl: filePath });
});

router.get("/fileurl/offical/:filename?", (req, res) => {
  if (!req.params.filename) return res.status(200).json({ fileurl: "" });

  const filePath = `${process.env.BASE_URL}api/files/offical/${req.params.filename}`;

  res.status(200).json({ fileurl: filePath });
});

module.exports = router;
