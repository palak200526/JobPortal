const jobModel = require("../models/jobModel");
const pool = require("../config/db");   // ← add this line

exports.postJob = async (req, res) => {

  try {

    const result = await jobModel.createJob(req.body);

    res.status(201).json({
      message: "Job posted successfully",
      jobId: result.insertId
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Server error" });

  }

};


exports.getJobs = async (req, res) => {

  try {

    const jobs = await jobModel.getAllJobs();

    res.json(jobs);

  } catch (error) {

    res.status(500).json({ error: "Server error" });

  }

};


exports.searchJobs = async (req, res) => {

  try {

    const { title, location, salary } = req.query;

    let query = "SELECT * FROM jobs WHERE 1=1";
    let values = [];

    if (title) {
      query += " AND title LIKE ?";
      values.push(`%${title}%`);
    }

    if (location) {
      query += " AND location LIKE ?";
      values.push(`%${location}%`);
    }

    if (salary) {
      query += " AND salary = ?";
      values.push(salary);
    }

    const [jobs] = await pool.query(query, values);

    res.json(jobs);

  } catch (error) {

    console.error(error);   // helpful for debugging
    res.status(500).json({ error: "Server error" });

  }

};