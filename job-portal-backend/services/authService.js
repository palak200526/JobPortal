const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AppError = require("../utils/AppError");
const userModel = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function mapUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    headline: user.headline,
    location: user.location,
    bio: user.bio,
    skills: user.skills,
    companyName: user.company_name,
    companyWebsite: user.company_website,
    roleTitle: user.role_title,
    resume: user.resume || null,
    createdAt: user.created_at,
  };
}

async function signup(payload) {
  const existingUser = await userModel.findUserByEmail(payload.email);

  if (existingUser) {
    throw new AppError("An account already exists with this email", 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, 12);

  const user = await userModel.createUser({
    name: payload.name,
    email: payload.email,
    password_hash: passwordHash,
    role: payload.role,
    phone: payload.phone || null,
    headline: payload.headline || null,
    location: payload.location || null,
    bio: payload.bio || null,
    skills: payload.skills || null,
    company_name: payload.companyName || null,
    company_website: payload.companyWebsite || null,
    role_title: payload.roleTitle || null,
  });

  const persistedUser = await userModel.findUserWithPasswordById(user.id);

  return {
    token: createToken(persistedUser),
    user: mapUser(persistedUser),
  };
}

async function login(payload) {
  const user = await userModel.findUserByEmail(payload.email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password_hash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    token: createToken(user),
    user: mapUser(user),
  };
}

async function getCurrentUser(userId) {
  const user = await userModel.getUserProfile(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return mapUser(user);
}

module.exports = {
  signup,
  login,
  getCurrentUser,
};
