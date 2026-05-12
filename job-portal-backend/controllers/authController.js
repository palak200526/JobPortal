const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");
const { sendSuccess } = require("../utils/apiResponse");

exports.signup = asyncHandler(async (req, res) => {
  const payload = await authService.signup(req.body);
  sendSuccess(res, "Account created successfully", payload, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const payload = await authService.login(req.body);
  sendSuccess(res, "Logged in successfully", payload);
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const payload = await authService.getCurrentUser(req.user.id);
  sendSuccess(res, "Authenticated user fetched", payload);
});

exports.logout = asyncHandler(async (_req, res) => {
  sendSuccess(res, "Logged out successfully");
});
