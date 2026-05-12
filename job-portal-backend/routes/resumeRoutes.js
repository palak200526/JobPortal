const express = require("express");

const resumeController = require("../controllers/resumeController");
const upload = require("../middleware/uploadMiddleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticate, authorizeRoles("seeker", "admin"), resumeController.getMyResume);
router.post(
  "/upload",
  authenticate,
  authorizeRoles("seeker", "admin"),
  upload.single("resume"),
  resumeController.uploadResume
);
router.delete("/", authenticate, authorizeRoles("seeker", "admin"), resumeController.deleteResume);

module.exports = router;
