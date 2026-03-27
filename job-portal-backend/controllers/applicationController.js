const applicationModel = require("../models/applicationModel");
const pool = require("../config/db");
const sendEmail = require("../utils/sendEmail");

exports.applyJob = async (req, res) => {

  try {

    const { job_id, seeker_id } = req.body;

    const result = await applicationModel.applyJob(job_id, seeker_id);

    // get recruiter email
    const [job] = await pool.query(
      `SELECT users.email
       FROM jobs
       JOIN users ON users.id = jobs.recruiter_id
       WHERE jobs.id = ?`,
      [job_id]
    );

    const recruiterEmail = job[0].email;

    await sendEmail(
      recruiterEmail,
      "New Job Application",
      "A new candidate has applied for your job."
    );

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: result.insertId
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Server error" });

  }

};


exports.getUserApplications = async (req, res) => {

  try {

    const seekerId = req.params.seekerId;

    const [applications] = await pool.query(
      `SELECT jobs.title, jobs.company_name, applications.status
       FROM applications
       JOIN jobs ON jobs.id = applications.job_id
       WHERE applications.seeker_id = ?`,
      [seekerId]
    );

    res.json(applications);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Server error" });

  }

};