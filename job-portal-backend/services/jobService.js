const AppError = require("../utils/AppError");
const jobModel = require("../models/jobModel");

async function createJob(recruiterId, payload) {
  const job = await jobModel.createJob({
    recruiter_id: recruiterId,
    category_id: payload.categoryId || null,
    title: payload.title,
    company: payload.company,
    description: payload.description,
    salary_min: payload.salaryMin || null,
    salary_max: payload.salaryMax || null,
    experience_level: payload.experienceLevel || null,
    experience_years: payload.experienceYears || null,
    job_type: payload.jobType,
    workplace_type: payload.workplaceType,
    skills: Array.isArray(payload.skills) ? payload.skills.join(", ") : payload.skills || null,
    deadline: payload.deadline || null,
    location: payload.location,
    status: "active",
    is_featured: Boolean(payload.isFeatured),
  });

  return jobModel.getJobById(job.id);
}

async function getJobs(query, user) {
  return jobModel.getJobs(query, user?.id || null);
}

async function getFeaturedJobs() {
  return jobModel.getFeaturedJobs();
}

async function getJobById(jobId, user) {
  const job = await jobModel.getJobById(jobId, user?.id || null);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  return job;
}

async function ensureRecruiterOwnsJob(jobId, recruiterId) {
  const job = await jobModel.getJobById(jobId);

  if (!job || job.recruiter_id !== recruiterId) {
    throw new AppError("Job not found", 404);
  }

  return job;
}

async function updateJob(jobId, recruiterId, payload) {
  await ensureRecruiterOwnsJob(jobId, recruiterId);

  const updatedJob = await jobModel.updateJob(jobId, {
    ...(payload.categoryId !== undefined && { category_id: payload.categoryId || null }),
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.company !== undefined && { company: payload.company }),
    ...(payload.description !== undefined && { description: payload.description }),
    ...(payload.salaryMin !== undefined && { salary_min: payload.salaryMin || null }),
    ...(payload.salaryMax !== undefined && { salary_max: payload.salaryMax || null }),
    ...(payload.experienceLevel !== undefined && { experience_level: payload.experienceLevel || null }),
    ...(payload.experienceYears !== undefined && { experience_years: payload.experienceYears || null }),
    ...(payload.jobType !== undefined && { job_type: payload.jobType }),
    ...(payload.workplaceType !== undefined && { workplace_type: payload.workplaceType }),
    ...(payload.skills !== undefined && { skills: Array.isArray(payload.skills) ? payload.skills.join(", ") : payload.skills }),
    ...(payload.deadline !== undefined && { deadline: payload.deadline || null }),
    ...(payload.location !== undefined && { location: payload.location }),
    updated_at: new Date(),
  });

  return updatedJob;
}

async function deleteJob(jobId, recruiterId) {
  await ensureRecruiterOwnsJob(jobId, recruiterId);
  await jobModel.deleteJob(jobId);
}

async function closeJob(jobId, recruiterId) {
  await ensureRecruiterOwnsJob(jobId, recruiterId);
  return jobModel.updateJob(jobId, {
    status: "closed",
    updated_at: new Date(),
  });
}

async function featureJob(jobId, recruiterId, isFeatured) {
  await ensureRecruiterOwnsJob(jobId, recruiterId);
  return jobModel.updateJob(jobId, {
    is_featured: isFeatured,
    updated_at: new Date(),
  });
}

async function getRecruiterJobs(recruiterId, query) {
  return jobModel.getRecruiterJobs(recruiterId, query);
}

async function getApplicantsForJob(jobId, recruiterId) {
  await ensureRecruiterOwnsJob(jobId, recruiterId);
  return jobModel.getApplicantsForJob(jobId, recruiterId);
}

module.exports = {
  createJob,
  getJobs,
  getFeaturedJobs,
  getJobById,
  updateJob,
  deleteJob,
  closeJob,
  featureJob,
  getRecruiterJobs,
  getApplicantsForJob,
};
