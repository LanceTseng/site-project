const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'files' directory exists
const uploadDir = path.join(__dirname, "../files");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to 'files/' directory
  },
  filename: (req, file, cb) => {
    const formatFileName =  file.originalname.replace(/ /g, "_");
    const uniqueName = Date.now() + "-" + formatFileName;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
  