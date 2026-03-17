console.log("jobRoutes loaded");
const express = require("express");
const router = express.Router();

// Dummy data (for now)
const jobs = [
  { id: 1, title: "Frontend Developer", company: "Google" },
  { id: 2, title: "Backend Developer", company: "Amazon" }
];

// GET featured jobs
router.get("/featured", (req, res) => {
  res.json(jobs);
});

module.exports = router;