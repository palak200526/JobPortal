const fs = require("fs/promises");
const path = require("path");

const AppError = require("../utils/AppError");
const resumeModel = require("../models/resumeModel");

const uploadsRoot = path.join(__dirname, "..", "uploads");

async function uploadResume(userId, file) {
  if (!file) {
    throw new AppError("Resume file is required", 400);
  }

  const existingResume = await resumeModel.getResumeByUser(userId);

  if (existingResume?.stored_name) {
    await fs.rm(path.join(uploadsRoot, existingResume.stored_name), { force: true });
  }

  return resumeModel.upsertResume(userId, file);
}

async function getResumeByUser(userId) {
  return resumeModel.getResumeByUser(userId);
}

async function deleteResume(userId) {
  const resume = await resumeModel.getResumeByUser(userId);

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  await fs.rm(path.join(uploadsRoot, resume.stored_name), { force: true });
  await resumeModel.deleteResumeByUser(userId);
}

module.exports = {
  uploadResume,
  getResumeByUser,
  deleteResume,
};
