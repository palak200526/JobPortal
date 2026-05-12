const AppError = require("../utils/AppError");
const userModel = require("../models/userModel");

async function getProfile(userId) {
  const profile = await userModel.getUserProfile(userId);

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  return {
    ...profile,
    companyName: profile.company_name,
    companyWebsite: profile.company_website,
    roleTitle: profile.role_title,
  };
}

async function updateProfile(userId, role, payload) {
  const profile = await userModel.findUserById(userId);

  if (!profile) {
    throw new AppError("Profile not found", 404);
  }

  const updated = await userModel.updateUser(userId, {
    ...(payload.name !== undefined && { name: payload.name }),
    ...(payload.phone !== undefined && { phone: payload.phone || null }),
    ...(payload.headline !== undefined && { headline: payload.headline || null }),
    ...(payload.location !== undefined && { location: payload.location || null }),
    ...(payload.bio !== undefined && { bio: payload.bio || null }),
    ...(role === "seeker" && payload.skills !== undefined && { skills: payload.skills || null }),
    ...(role === "recruiter" && payload.companyName !== undefined && { company_name: payload.companyName || null }),
    ...(role === "recruiter" && payload.companyWebsite !== undefined && { company_website: payload.companyWebsite || null }),
    ...(role === "recruiter" && payload.roleTitle !== undefined && { role_title: payload.roleTitle || null }),
    updated_at: new Date(),
  });

  return {
    ...updated,
    companyName: updated.company_name,
    companyWebsite: updated.company_website,
    roleTitle: updated.role_title,
  };
}

module.exports = {
  getProfile,
  updateProfile,
};
