const AppError = require("../utils/AppError");

function notFoundHandler(req, _res, next) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: error.errors || [],
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
