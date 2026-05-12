const express = require("express");

const analyticsController = require("../controllers/analyticsController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/recruiter", authenticate, authorizeRoles("recruiter", "admin"), analyticsController.getRecruiterAnalytics);

module.exports = router;
