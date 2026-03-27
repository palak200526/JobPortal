const pool = require("../config/db");

exports.applyJob = async (job_id, seeker_id) => {
  const [result] = await pool.query(
    "INSERT INTO applications (job_id, seeker_id) VALUES (?, ?)",
    [job_id, seeker_id]
  );

  return result;
};