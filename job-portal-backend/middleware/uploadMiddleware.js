const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");

const AppError = require("../utils/AppError");

const uploadDirectory = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString("hex");
    cb(null, `${safeName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_RESUME_SIZE_BYTES || 5 * 1024 * 1024),
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new AppError("Only PDF, DOC, and DOCX resumes are allowed", 400));
      return;
    }

    cb(null, true);
  },
});

module.exports = upload;
