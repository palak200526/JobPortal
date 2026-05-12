const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";

exports.authenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new AppError("Authentication token is required", 401);
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await userModel.findUserById(decoded.id);

  if (!user) {
    throw new AppError("User session is no longer valid", 401);
  }

  req.user = user;
  next();
});

exports.optionalAuthenticate = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findUserById(decoded.id);
    req.user = user || null;
  } catch (_error) {
    req.user = null;
  }

  next();
});

exports.authorizeRoles = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    next(new AppError("You are not authorized to access this resource", 403));
    return;
  }

  next();
};
