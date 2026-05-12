const AppError = require("../utils/AppError");
const jobModel = require("../models/jobModel");
const savedJobModel = require("../models/savedJobModel");

async function saveJob(userId, jobId) {
  const job = await jobModel.getJobById(jobId, userId);

  if (!job || job.status !== "active") {
    throw new AppError("Job not found", 404);
  }

  const existingSavedJob = await savedJobModel.getSavedJob(userId, jobId);

  if (existingSavedJob) {
    throw new AppError("Job is already saved", 409);
  }

  return savedJobModel.saveJob(userId, jobId);
}

async function removeSavedJob(userId, jobId) {
  const existingSavedJob = await savedJobModel.getSavedJob(userId, jobId);

  if (!existingSavedJob) {
    throw new AppError("Saved job not found", 404);
  }

  await savedJobModel.removeSavedJob(userId, jobId);
}

async function getSavedJobs(userId) {
  return savedJobModel.getSavedJobs(userId);
}

module.exports = {
  saveJob,
  removeSavedJob,
  getSavedJobs,
};
