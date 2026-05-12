const db = require("../config/db");

async function getRecruiterAnalytics(recruiterId) {
  const params = [recruiterId];
  const [jobCounts, applicantCount, recentApplications] = await Promise.all([
    db.one(
      `SELECT
         COUNT(*) AS total_jobs,
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_jobs,
         SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS closed_jobs
       FROM jobs
       WHERE recruiter_id = ${db.placeholder(1)}`,
      params
    ),
    db.one(
      `SELECT COUNT(*) AS total_applicants
       FROM applications a
       INNER JOIN jobs j ON j.id = a.job_id
       WHERE j.recruiter_id = ${db.placeholder(1)}`,
      params
    ),
    db.all(
      `SELECT a.id, a.status, a.created_at, u.name, j.title
       FROM applications a
       INNER JOIN jobs j ON j.id = a.job_id
       INNER JOIN users u ON u.id = a.user_id
       WHERE j.recruiter_id = ${db.placeholder(1)}
       ORDER BY a.created_at DESC
       LIMIT 5`,
      params
    ),
  ]);

  return {
    totals: {
      totalJobs: Number(jobCounts?.total_jobs || 0),
      activeJobs: Number(jobCounts?.active_jobs || 0),
      closedJobs: Number(jobCounts?.closed_jobs || 0),
      totalApplicants: Number(applicantCount?.total_applicants || 0),
    },
    recentApplications,
  };
}

module.exports = {
  getRecruiterAnalytics,
};
