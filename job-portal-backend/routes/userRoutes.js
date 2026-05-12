const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get("/profile", authenticate, userController.getProfile);
router.patch(
  "/profile",
  authenticate,
  body("name").optional().trim().isLength({ min: 2, max: 120 }),
  body("phone").optional().trim().isLength({ max: 30 }),
  body("headline").optional().trim().isLength({ max: 180 }),
  body("location").optional().trim().isLength({ max: 180 }),
  body("bio").optional().trim().isLength({ max: 1000 }),
  body("companyWebsite").optional({ values: "falsy" }).isURL().withMessage("Company website must be a valid URL"),
  validateRequest,
  userController.updateProfile
);

module.exports = router;
