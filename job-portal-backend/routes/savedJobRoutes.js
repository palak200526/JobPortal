const express = require("express");
const { param } = require("express-validator");

const savedJobController = require("../controllers/savedJobController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", authenticate, authorizeRoles("seeker", "admin"), savedJobController.getSavedJobs);
router.post(
  "/:jobId",
  authenticate,
  authorizeRoles("seeker", "admin"),
  param("jobId").isInt({ min: 1 }),
  validateRequest,
  savedJobController.saveJob
);
router.delete(
  "/:jobId",
  authenticate,
  authorizeRoles("seeker", "admin"),
  param("jobId").isInt({ min: 1 }),
  validateRequest,
  savedJobController.removeSavedJob
);

module.exports = router;
