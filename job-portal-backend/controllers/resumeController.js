const asyncHandler = require("../utils/asyncHandler");
const resumeService = require("../services/resumeService");
const { sendSuccess } = require("../utils/apiResponse");

exports.uploadResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.uploadResume(req.user.id, req.file);
  sendSuccess(res, "Resume uploaded successfully", resume, 201);
});

exports.getMyResume = asyncHandler(async (req, res) => {
  const resume = await resumeService.getResumeByUser(req.user.id);
  sendSuccess(res, "Resume fetched", resume);
});

exports.deleteResume = asyncHandler(async (req, res) => {
  await resumeService.deleteResume(req.user.id);
  sendSuccess(res, "Resume deleted successfully");
});
