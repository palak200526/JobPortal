const asyncHandler = require("../utils/asyncHandler");
const jobService = require("../services/jobService");
const { sendSuccess } = require("../utils/apiResponse");

exports.createJob = asyncHandler(async (req, res) => {
  const job = await jobService.createJob(req.user.id, req.body);
  sendSuccess(res, "Job created successfully", job, 201);
});

exports.getJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getJobs(req.query, req.user);
  sendSuccess(res, "Jobs fetched", jobs);
});

exports.getFeaturedJobs = asyncHandler(async (_req, res) => {
  const jobs = await jobService.getFeaturedJobs();
  sendSuccess(res, "Featured jobs fetched", jobs);
});

exports.getJobById = asyncHandler(async (req, res) => {
  const job = await jobService.getJobById(Number(req.params.jobId), req.user);
  sendSuccess(res, "Job details fetched", job);
});

exports.updateJob = asyncHandler(async (req, res) => {
  const job = await jobService.updateJob(Number(req.params.jobId), req.user.id, req.body);
  sendSuccess(res, "Job updated successfully", job);
});

exports.deleteJob = asyncHandler(async (req, res) => {
  await jobService.deleteJob(Number(req.params.jobId), req.user.id);
  sendSuccess(res, "Job deleted successfully");
});

exports.closeJob = asyncHandler(async (req, res) => {
  const job = await jobService.closeJob(Number(req.params.jobId), req.user.id);
  sendSuccess(res, "Job closed successfully", job);
});

exports.featureJob = asyncHandler(async (req, res) => {
  const job = await jobService.featureJob(Number(req.params.jobId), req.user.id, Boolean(req.body.isFeatured));
  sendSuccess(res, "Job feature state updated", job);
});

exports.getRecruiterJobs = asyncHandler(async (req, res) => {
  const jobs = await jobService.getRecruiterJobs(req.user.id, req.query);
  sendSuccess(res, "Recruiter jobs fetched", jobs);
});

exports.getApplicantsForJob = asyncHandler(async (req, res) => {
  const applicants = await jobService.getApplicantsForJob(Number(req.params.jobId), req.user.id);
  sendSuccess(res, "Applicants fetched", applicants);
});
