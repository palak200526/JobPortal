const db = require("../config/db");

async function createUser(data) {
  return db.insert("users", data);
}

async function findUserByEmail(email) {
  return db.one(`SELECT * FROM users WHERE email = ${db.placeholder(1)}`, [email]);
}

async function findUserById(id) {
  return db.one(
    `SELECT id, name, email, role, phone, headline, location, bio, skills,
            company_name, company_website, role_title, created_at, updated_at
     FROM users
     WHERE id = ${db.placeholder(1)}`,
    [id]
  );
}

async function findUserWithPasswordById(id) {
  return db.one(`SELECT * FROM users WHERE id = ${db.placeholder(1)}`, [id]);
}

async function updateUser(id, data) {
  const whereClause = `id = ${db.placeholder(Object.keys(data).length + 1)}`;
  await db.update("users", data, whereClause, [id]);
  return findUserById(id);
}

async function getUserProfile(id) {
  const user = await findUserById(id);
  const resume = await db.one(`SELECT id, file_name, file_path, mime_type, file_size FROM resumes WHERE user_id = ${db.placeholder(1)}`, [id]);
  return {
    ...user,
    resume,
  };
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserWithPasswordById,
  updateUser,
  getUserProfile,
};
