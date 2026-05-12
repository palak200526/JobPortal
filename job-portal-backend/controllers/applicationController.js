const asyncHandler = require("../utils/asyncHandler");
const applicationService = require("../services/applicationService");
const { sendSuccess } = require("../utils/apiResponse");

exports.applyToJob = asyncHandler(async (req, res) => {
  const application = await applicationService.applyToJob(req.user, req.body);
  sendSuccess(res, "Application submitted successfully", application, 201);
});

exports.getMyApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getApplicationsForUser(req.user.id, req.query);
  sendSuccess(res, "Applications fetched", applications);
});

exports.withdrawApplication = asyncHandler(async (req, res) => {
  await applicationService.withdrawApplication(req.user.id, Number(req.params.applicationId));
  sendSuccess(res, "Application withdrawn");
});

exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus(
    req.user.id,
    Number(req.params.applicationId),
    req.body
  );
  sendSuccess(res, "Application status updated", application);
});
