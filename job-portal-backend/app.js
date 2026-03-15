require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// Routes
app.use("/api/auth", authRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("Job Portal API Running");
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});