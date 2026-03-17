require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ IMPORT ROUTES
const jobRoutes = require("./routes/jobRoutes");

// ✅ USE ROUTES
app.use("/api/jobs", jobRoutes);

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Job Portal API Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});