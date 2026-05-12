const AppError = require("../utils/AppError");
const applicationModel = require("../models/applicationModel");
const jobModel = require("../models/jobModel");
const resumeModel = require("../models/resumeModel");

async function applyToJob(user, payload) {
  const jobId = Number(payload.jobId);
  const job = await jobModel.getJobById(jobId, user.id);

  if (!job || job.status !== "active") {
    throw new AppError("Job is unavailable for applications", 404);
  }

  const existingApplication = await applicationModel.findApplicationByUserAndJob(user.id, jobId);

  if (existingApplication) {
    throw new AppError("You have already applied for this job", 409);
  }

  const resume = await resumeModel.getResumeByUser(user.id);

  if (!resume) {
    throw new AppError("Upload a resume before applying", 400);
  }

  const application = await applicationModel.createApplication({
    user_id: user.id,
    job_id: jobId,
    status: "Applied",
    cover_letter: payload.coverLetter || null,
  });

  await applicationModel.createStatusHistory({
    application_id: application.id,
    status: "Applied",
    note: "Initial application submitted",
    changed_by: user.id,
  });

  return applicationModel.findApplicationById(application.id);
}

async function getApplicationsForUser(userId, filters) {
  const items = await applicationModel.getApplicationsForUser(userId, filters);
  const enrichedItems = await Promise.all(
    items.map(async (item) => ({
      ...item,
      history: await applicationModel.getStatusHistory(item.id),
    }))
  );

  return enrichedItems;
}

async function withdrawApplication(userId, applicationId) {
  const application = await applicationModel.findApplicationById(applicationId);

  if (!application || application.user_id !== userId) {
    throw new AppError("Application not found", 404);
  }

  if (application.status === "Accepted") {
    throw new AppError("Accepted applications cannot be withdrawn", 400);
  }

  await applicationModel.updateApplication(applicationId, {
    status: "Withdrawn",
    updated_at: new Date(),
  });

  await applicationModel.createStatusHistory({
    application_id: applicationId,
    status: "Withdrawn",
    note: "Candidate withdrew the application",
    changed_by: userId,
  });
}

async function updateApplicationStatus(recruiterId, applicationId, payload) {
  const application = await applicationModel.findApplicationById(applicationId);

  if (!application || application.recruiter_id !== recruiterId) {
    throw new AppError("Application not found", 404);
  }

  const updated = await applicationModel.updateApplication(applicationId, {
    status: payload.status,
    updated_at: new Date(),
  });

  await applicationModel.createStatusHistory({
    application_id: applicationId,
    status: payload.status,
    note: payload.note || null,
    changed_by: recruiterId,
  });

  return {
    ...updated,
    history: await applicationModel.getStatusHistory(applicationId),
  };
}

module.exports = {
  applyToJob,
  getApplicationsForUser,
  withdrawApplication,
  updateApplicationStatus,
};
