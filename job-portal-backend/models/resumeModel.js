const db = require("../config/db");

async function getResumeByUser(userId) {
  return db.one(`SELECT * FROM resumes WHERE user_id = ${db.placeholder(1)}`, [userId]);
}

async function upsertResume(userId, file) {
  const existing = await getResumeByUser(userId);

  const payload = {
    user_id: userId,
    file_name: file.originalname,
    stored_name: file.filename,
    file_path: `/uploads/${file.filename}`,
    mime_type: file.mimetype,
    file_size: file.size,
  };

  if (!existing) {
    return db.insert("resumes", payload);
  }

  await db.update(
    "resumes",
    {
      file_name: file.originalname,
      stored_name: file.filename,
      file_path: `/uploads/${file.filename}`,
      mime_type: file.mimetype,
      file_size: file.size,
      updated_at: new Date(),
    },
    `user_id = ${db.placeholder(7)}`,
    [userId]
  );

  return getResumeByUser(userId);
}

async function deleteResumeByUser(userId) {
  return db.remove("resumes", `user_id = ${db.placeholder(1)}`, [userId]);
}

module.exports = {
  getResumeByUser,
  upsertResume,
  deleteResumeByUser,
};
