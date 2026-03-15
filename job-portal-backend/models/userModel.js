const pool = require("../config/db");

exports.findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows;
};

exports.createUser = async (name, email, password, role) => {
  const [result] = await pool.query(
    "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
    [name, email, password, role]
  );
  return result.insertId;
};

exports.createSeekerProfile = async (userId, skills, resume) => {
  await pool.query(
    "INSERT INTO seeker_profiles (user_id,skills,resume_url) VALUES (?,?,?)",
    [userId, skills, resume]
  );
};

exports.createRecruiterProfile = async (userId, company, website, title) => {
  await pool.query(
    "INSERT INTO recruiter_profiles (user_id,company_name,company_website,role_title) VALUES (?,?,?,?)",
    [userId, company, website, title]
  );
};