const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/documents");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      crypto.randomUUID() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG and PNG files are allowed."));
  }
};

// Upload Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;