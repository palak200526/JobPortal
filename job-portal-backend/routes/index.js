const express = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const jobRoutes = require("./jobRoutes");
const applicationRoutes = require("./applicationRoutes");
const savedJobRoutes = require("./savedJobRoutes");
const resumeRoutes = require("./resumeRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const categoryRoutes = require("./categoryRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/saved-jobs", savedJobRoutes);
router.use("/resume", resumeRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
