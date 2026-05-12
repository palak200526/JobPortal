require("dotenv").config();

const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");
const { sanitizeRequest } = require("./utils/sanitize");

const app = express();

app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));

app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true,
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || (process.env.NODE_ENV === "production" ? 200 : 1000)),
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(sanitizeRequest);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AuraJobs API is healthy",
    data: { uptime: process.uptime() },
  });
});

app.use("/api", routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
