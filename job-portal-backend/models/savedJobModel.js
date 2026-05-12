const db = require("../config/db");

async function saveJob(userId, jobId) {
  return db.insert("saved_jobs", {
    user_id: userId,
    job_id: jobId,
  });
}

async function getSavedJob(userId, jobId) {
  return db.one(
    `SELECT * FROM saved_jobs WHERE user_id = ${db.placeholder(1)} AND job_id = ${db.placeholder(2)}`,
    [userId, jobId]
  );
}

async function removeSavedJob(userId, jobId) {
  return db.remove(
    "saved_jobs",
    `user_id = ${db.placeholder(1)} AND job_id = ${db.placeholder(2)}`,
    [userId, jobId]
  );
}

async function getSavedJobs(userId) {
  return db.all(
    `SELECT sj.id, sj.created_at, j.id AS job_id, j.title, j.company, j.location, j.job_type,
            j.workplace_type, j.salary_min, j.salary_max, j.deadline
     FROM saved_jobs sj
     INNER JOIN jobs j ON j.id = sj.job_id
     WHERE sj.user_id = ${db.placeholder(1)}
     ORDER BY sj.created_at DESC`,
    [userId]
  );
}

module.exports = {
  saveJob,
  getSavedJob,
  removeSavedJob,
  getSavedJobs,
};
