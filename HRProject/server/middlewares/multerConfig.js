const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'files' directory exists
const uploadUserFileDir = path.join(__dirname, "../files");
if (!fs.existsSync(uploadUserFileDir)) {
  fs.mkdirSync(uploadUserFileDir, { recursive: true });
}

const uploadOfficialFileDir = path.join(__dirname, "../files/offical");
if (!fs.existsSync(uploadOfficialFileDir)) {
  fs.mkdirSync(uploadOfficialFileDir, { recursive: true });
}

// Multer Storage Configuration
const storageUserUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadUserFileDir); // Save files to 'files/' directory
  },
  filename: (req, file, cb) => {
    const formatFileName = file.originalname.replace(/ /g, "_");
    const uniqueName = Date.now() + "-" + formatFileName;
    cb(null, uniqueName);
  },
});

const storageOfficialUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadOfficialFileDir); // Save files to 'files/' directory
  },
  filename: (req, file, cb) => {
    const formatFileName = file.originalname.replace(/ /g, "_");
    const uniqueName = Date.now() + "-" + formatFileName;
    cb(null, uniqueName);
  },
});

const uploadUserFile = multer({ storage: storageUserUpload });
const uploadOfficalFile = multer({ storage: storageOfficialUpload });

module.exports = {
  uploadUserFile,
  uploadOfficalFile,
};
