const express = require("express");
const { body, param, query } = require("express-validator");

const jobController = require("../controllers/jobController");
const { authenticate, optionalAuthenticate, authorizeRoles } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", optionalAuthenticate, jobController.getJobs);
router.get("/featured", jobController.getFeaturedJobs);
router.get(
  "/recruiter/mine",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  jobController.getRecruiterJobs
);
router.get(
  "/:jobId/applicants",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  param("jobId").isInt({ min: 1 }),
  validateRequest,
  jobController.getApplicantsForJob
);
router.get(
  "/:jobId",
  optionalAuthenticate,
  param("jobId").isInt({ min: 1 }),
  validateRequest,
  jobController.getJobById
);

router.post(
  "/",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  body("title").trim().isLength({ min: 3, max: 180 }),
  body("company").trim().isLength({ min: 2, max: 180 }),
  body("description").trim().isLength({ min: 50 }),
  body("location").trim().isLength({ min: 2, max: 180 }),
  body("jobType").isIn(["Full-time", "Part-time", "Contract", "Internship", "Freelance"]),
  body("workplaceType").isIn(["Remote", "Hybrid", "On-site"]),
  body("categoryId").optional().isInt({ min: 1 }),
  body("salaryMin").optional().isInt({ min: 0 }),
  body("salaryMax").optional().isInt({ min: 0 }),
  body("experienceYears").optional().isInt({ min: 0 }),
  validateRequest,
  jobController.createJob
);

router.put(
  "/:jobId",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  param("jobId").isInt({ min: 1 }),
  body("title").optional().trim().isLength({ min: 3, max: 180 }),
  body("company").optional().trim().isLength({ min: 2, max: 180 }),
  body("description").optional().trim().isLength({ min: 50 }),
  validateRequest,
  jobController.updateJob
);

router.patch(
  "/:jobId/close",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  param("jobId").isInt({ min: 1 }),
  validateRequest,
  jobController.closeJob
);

router.patch(
  "/:jobId/feature",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  param("jobId").isInt({ min: 1 }),
  body("isFeatured").isBoolean(),
  validateRequest,
  jobController.featureJob
);

router.delete(
  "/:jobId",
  authenticate,
  authorizeRoles("recruiter", "admin"),
  param("jobId").isInt({ min: 1 }),
  validateRequest,
  jobController.deleteJob
);

module.exports = router;
