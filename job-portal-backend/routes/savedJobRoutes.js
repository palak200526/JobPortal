const express = require("express");
const router = express.Router();

const savedJobController = require("../controllers/savedJobController");

router.post("/", savedJobController.saveJob);
router.get("/:seekerId", savedJobController.getSavedJobs);
router.delete("/:id", savedJobController.deleteSavedJob);

module.exports = router;