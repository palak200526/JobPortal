const pool = require("../config/db");

exports.saveJob = async (seeker_id, job_id) => {

  const [result] = await pool.query(
    "INSERT INTO saved_jobs (seeker_id, job_id) VALUES (?, ?)",
    [seeker_id, job_id]
  );

  return result;

};

exports.getSavedJobs = async (seeker_id) => {

  const [rows] = await pool.query(
    `SELECT jobs.id, jobs.title, jobs.company_name, jobs.location
     FROM saved_jobs
     JOIN jobs ON jobs.id = saved_jobs.job_id
     WHERE saved_jobs.seeker_id = ?`,
    [seeker_id]
  );

  return rows;

};

exports.deleteSavedJob = async (id) => {

  const [result] = await pool.query(
    "DELETE FROM saved_jobs WHERE id = ?",
    [id]
  );

  return result;

};