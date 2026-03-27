const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");

router.post("/apply", applicationController.applyJob);
router.get("/user/:seekerId", applicationController.getUserApplications);

module.exports = router;