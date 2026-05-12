const db = require("../config/db");

function addParam(params, value) {
  params.push(value);
  return db.placeholder(params.length);
}

async function createApplication(data) {
  return db.insert("applications", data);
}

async function createStatusHistory(data) {
  return db.insert("application_status_history", data);
}

async function findApplicationByUserAndJob(userId, jobId) {
  const params = [];
  return db.one(
    `SELECT * FROM applications
     WHERE user_id = ${addParam(params, userId)}
       AND job_id = ${addParam(params, jobId)}`,
    params
  );
}

async function findApplicationById(applicationId) {
  const params = [];
  return db.one(
    `SELECT a.*, j.title AS job_title, j.recruiter_id, j.company, u.name AS candidate_name, u.email AS candidate_email
     FROM applications a
     INNER JOIN jobs j ON j.id = a.job_id
     INNER JOIN users u ON u.id = a.user_id
     WHERE a.id = ${addParam(params, applicationId)}`,
    params
  );
}

async function getApplicationsForUser(userId, filters = {}) {
  const params = [];
  const conditions = [`a.user_id = ${addParam(params, userId)}`];

  if (filters.status) {
    conditions.push(`a.status = ${addParam(params, filters.status)}`);
  }

  return db.all(
    `SELECT a.id, a.status, a.cover_letter, a.created_at, a.updated_at,
            j.id AS job_id, j.title, j.company, j.location, j.job_type, j.workplace_type,
            (
              SELECT COUNT(*)
              FROM application_status_history ash
              WHERE ash.application_id = a.id
            ) AS status_events
     FROM applications a
     INNER JOIN jobs j ON j.id = a.job_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY a.created_at DESC`,
    params
  );
}

async function getStatusHistory(applicationId) {
  const params = [];
  return db.all(
    `SELECT ash.id, ash.status, ash.note, ash.created_at, u.name AS changed_by_name
     FROM application_status_history ash
     INNER JOIN users u ON u.id = ash.changed_by
     WHERE ash.application_id = ${addParam(params, applicationId)}
     ORDER BY ash.created_at DESC`,
    params
  );
}

async function updateApplication(applicationId, data) {
  const whereClause = `id = ${db.placeholder(Object.keys(data).length + 1)}`;
  await db.update("applications", data, whereClause, [applicationId]);
  return findApplicationById(applicationId);
}

async function getApplicationsForRecruiter(recruiterId, filters = {}) {
  const params = [];
  const conditions = [`j.recruiter_id = ${addParam(params, recruiterId)}`];

  if (filters.status) {
    conditions.push(`a.status = ${addParam(params, filters.status)}`);
  }

  if (filters.jobId) {
    conditions.push(`a.job_id = ${addParam(params, Number(filters.jobId))}`);
  }

  return db.all(
    `SELECT a.id, a.status, a.created_at, a.updated_at, a.cover_letter,
            u.id AS user_id, u.name, u.email, u.headline, u.location, u.skills,
            j.id AS job_id, j.title, j.company
     FROM applications a
     INNER JOIN users u ON u.id = a.user_id
     INNER JOIN jobs j ON j.id = a.job_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY a.updated_at DESC`,
    params
  );
}

module.exports = {
  createApplication,
  createStatusHistory,
  findApplicationByUserAndJob,
  findApplicationById,
  getApplicationsForUser,
  getApplicationsForRecruiter,
  getStatusHistory,
  updateApplication,
};
