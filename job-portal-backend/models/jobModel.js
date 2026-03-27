const pool = require("../config/db");

exports.createJob = async (jobData) => {

  const { recruiter_id, title, company_name, location, salary, description } = jobData;

  const [result] = await pool.query(
    `INSERT INTO jobs 
    (recruiter_id,title,company_name,location,salary,description)
    VALUES (?,?,?,?,?,?)`,
    [recruiter_id, title, company_name, location, salary, description]
  );

  return result;
};


exports.getAllJobs = async () => {

  const [rows] = await pool.query(
    "SELECT * FROM jobs ORDER BY created_at DESC"
  );

  return rows;

};