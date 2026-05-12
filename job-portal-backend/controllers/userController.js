const asyncHandler = require("../utils/asyncHandler");
const userService = require("../services/userService");
const { sendSuccess } = require("../utils/apiResponse");

exports.getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);
  sendSuccess(res, "Profile fetched", profile);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(req.user.id, req.user.role, req.body);
  sendSuccess(res, "Profile updated successfully", profile);
});
