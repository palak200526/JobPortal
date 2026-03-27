const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const resumeController = require("../controllers/resumeController");

router.post(
  "/upload",
  upload.single("resume"),
  resumeController.uploadResume
);

module.exports = router;