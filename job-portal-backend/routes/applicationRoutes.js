const express = require("express");
const { body, param, query } = require("express-validator");

const applicationController = require("../controllers/applicationController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("seeker", "admin"),
  body("jobId").isInt({ min: 1 }).withMessage("A valid jobId is required"),
  body("coverLetter").optional().isLength({ max: 1500 }).withMessage("Cover letter must be under 1500 characters"),
  validateRequest,
  applicationController.applyToJob
);

router.get(
  "/my",
  authenticate,
  authorizeRoles("seeker", "admin"),
  query("status").optional().isString(),
  validateRequest,
  applicationController.getMyApplications
);

router.patch(
  "/:applicationId/withdraw",
  authenticate,
  authorizeRoles("seeker", "admin"),
  param("applicationId").isInt({ min: 1 }),
  validateRequest,
  applicationController.withdrawApplication
);

router.patch(
  "/:applicationId/status",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  param("applicationId").isInt({ min: 1 }),
  body("status").isIn(["Under Review", "Shortlisted", "Accepted", "Rejected"]).withMessage("Invalid application status"),
  body("note").optional().isLength({ max: 500 }).withMessage("Status note must be under 500 characters"),
  validateRequest,
  applicationController.updateApplicationStatus
);

module.exports = router;
