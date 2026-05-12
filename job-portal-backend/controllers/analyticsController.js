const asyncHandler = require("../utils/asyncHandler");
const analyticsService = require("../services/analyticsService");
const { sendSuccess } = require("../utils/apiResponse");

exports.getRecruiterAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getRecruiterAnalytics(req.user.id);
  sendSuccess(res, "Recruiter analytics fetched", analytics);
});
