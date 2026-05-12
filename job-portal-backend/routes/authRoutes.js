const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/signup",
  body("name").trim().isLength({ min: 2, max: 120 }).withMessage("Name must be between 2 and 120 characters"),
  body("email").isEmail().withMessage("A valid email address is required").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
    .withMessage("Password must include uppercase, lowercase, number, and special character"),
  body("role").isIn(["recruiter", "seeker", "admin"]).withMessage("Role must be recruiter, seeker, or admin"),
  body("companyName").optional().isLength({ max: 180 }),
  body("companyWebsite").optional({ values: "falsy" }).isURL().withMessage("Company website must be a valid URL"),
  validateRequest,
  authController.signup
);

router.post(
  "/login",
  body("email").isEmail().withMessage("A valid email address is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
  authController.login
);

router.get("/me", authenticate, authController.getCurrentUser);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
