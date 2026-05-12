function sanitizeValue(value) {
  if (typeof value === "string") {
    return value.trim().replace(/\0/g, "").replace(/[<>]/g, "");
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)]));
  }

  return value;
}

function sanitizeRequest(req, _res, next) {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  next();
}

module.exports = {
  sanitizeRequest,
};
