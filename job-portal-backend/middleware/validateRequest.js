const { validationResult } = require("express-validator");

module.exports = function validateRequest(req, _res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    next();
    return;
  }

  next({
    statusCode: 422,
    message: "Validation failed",
    errors: result.array().map((item) => ({
      field: item.path,
      message: item.msg,
    })),
  });
};
