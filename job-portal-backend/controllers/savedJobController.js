const asyncHandler = require("../utils/asyncHandler");
const savedJobService = require("../services/savedJobService");
const { sendSuccess } = require("../utils/apiResponse");

exports.saveJob = asyncHandler(async (req, res) => {
  const payload = await savedJobService.saveJob(req.user.id, Number(req.params.jobId));
  sendSuccess(res, "Job saved successfully", payload, 201);
});

exports.removeSavedJob = asyncHandler(async (req, res) => {
  await savedJobService.removeSavedJob(req.user.id, Number(req.params.jobId));
  sendSuccess(res, "Saved job removed");
});

exports.getSavedJobs = asyncHandler(async (req, res) => {
  const jobs = await savedJobService.getSavedJobs(req.user.id);
  sendSuccess(res, "Saved jobs fetched", jobs);
});
