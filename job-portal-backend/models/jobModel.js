const db = require("../config/db");

function addParam(params, value) {
  params.push(value);
  return db.placeholder(params.length);
}

function buildSearchTerms(value) {
  const term = String(value || "").trim().toLowerCase();

  if (!term) {
    return [];
  }

  const terms = new Set([term]);

  if (term.includes("banglore")) {
    terms.add(term.replaceAll("banglore", "bangalore"));
    terms.add(term.replaceAll("banglore", "bengaluru"));
  }

  if (term.includes("bangalore")) {
    terms.add(term.replaceAll("bangalore", "bengaluru"));
  }

  if (term.includes("bengaluru")) {
    terms.add(term.replaceAll("bengaluru", "bangalore"));
  }

  return Array.from(terms);
}

function addLikeSearch(params, columns, value) {
  const terms = buildSearchTerms(value);

  if (!terms.length) {
    return null;
  }

  const clauses = [];

  for (const term of terms) {
    const pattern = `%${term}%`;

    for (const column of columns) {
      clauses.push(`LOWER(${column}) LIKE ${addParam(params, pattern)}`);
    }
  }

  return `(${clauses.join(" OR ")})`;
}

function parsePagination(query = {}) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 9), 1), 50);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function buildJobFilters(filters = {}, userId) {
  const params = [];
  const conditions = [`j.status = 'active'`];

  if (filters.keyword) {
    const keywordCondition = addLikeSearch(params, ["j.title", "j.company", "j.description", "j.skills", "j.location"], filters.keyword);

    if (keywordCondition) {
      conditions.push(keywordCondition);
    }
  }

  if (filters.location) {
    const locationCondition = addLikeSearch(params, ["j.location"], filters.location);

    if (locationCondition) {
      conditions.push(locationCondition);
    }
  }

  if (filters.categoryId) {
    conditions.push(`j.category_id = ${addParam(params, Number(filters.categoryId))}`);
  }

  if (filters.jobType) {
    conditions.push(`j.job_type = ${addParam(params, filters.jobType)}`);
  }

  if (filters.workplaceType) {
    conditions.push(`j.workplace_type = ${addParam(params, filters.workplaceType)}`);
  }

  if (filters.experienceLevel) {
    conditions.push(`j.experience_level = ${addParam(params, filters.experienceLevel)}`);
  }

  if (filters.salaryMin) {
    conditions.push(`j.salary_max >= ${addParam(params, Number(filters.salaryMin))}`);
  }

  return { params, conditions };
}

async function createJob(data) {
  return db.insert("jobs", data);
}

async function updateJob(jobId, data) {
  const whereClause = `id = ${db.placeholder(Object.keys(data).length + 1)}`;
  await db.update("jobs", data, whereClause, [jobId]);
  return getJobById(jobId);
}

async function deleteJob(jobId) {
  return db.remove("jobs", `id = ${db.placeholder(1)}`, [jobId]);
}

async function getJobById(jobId, userId = null) {
  const params = [];
  const savedSelect = userId
    ? `EXISTS(
        SELECT 1 FROM saved_jobs sj
        WHERE sj.job_id = j.id AND sj.user_id = ${addParam(params, userId)}
      ) AS is_saved,`
    : `FALSE AS is_saved,`;

  const appliedSelect = userId
    ? `EXISTS(
        SELECT 1 FROM applications a
        WHERE a.job_id = j.id AND a.user_id = ${addParam(params, userId)}
      ) AS has_applied,`
    : `FALSE AS has_applied,`;

  return db.one(
    `SELECT j.*, c.name AS category_name, u.name AS recruiter_name, u.company_name, u.company_website,
            ${savedSelect}
            ${appliedSelect}
            (
              SELECT COUNT(*)
              FROM applications a2
              WHERE a2.job_id = j.id
            ) AS applicant_count
     FROM jobs j
     LEFT JOIN categories c ON c.id = j.category_id
     INNER JOIN users u ON u.id = j.recruiter_id
     WHERE j.id = ${addParam(params, jobId)}`,
    params
  );
}

async function getJobs(filters = {}, userId = null) {
  const { page, limit, offset } = parsePagination(filters);
  const { params, conditions } = buildJobFilters(filters);
  const sortBy = filters.sortBy === "salary" ? "j.salary_max DESC" : filters.sortBy === "deadline" ? "j.deadline ASC" : "j.created_at DESC";

  const rows = await db.all(
    `SELECT j.id, j.title, j.company, j.location, j.salary_min, j.salary_max, j.experience_level,
            j.job_type, j.workplace_type, j.is_featured, j.deadline, j.created_at, c.name AS category_name,
            EXISTS(
              SELECT 1 FROM saved_jobs sj
              WHERE sj.job_id = j.id${userId ? ` AND sj.user_id = ${db.placeholder(params.length + 1)}` : " AND 1 = 0"}
            ) AS is_saved
     FROM jobs j
     LEFT JOIN categories c ON c.id = j.category_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY j.is_featured DESC, ${sortBy}
     LIMIT ${limit} OFFSET ${offset}`,
    userId ? [...params, userId] : params
  );

  const countRows = await db.all(
    `SELECT COUNT(*) AS total
     FROM jobs j
     LEFT JOIN categories c ON c.id = j.category_id
     WHERE ${conditions.join(" AND ")}`,
    params
  );

  return {
    items: rows,
    pagination: {
      page,
      limit,
      total: Number(countRows[0]?.total || 0),
    },
  };
}

async function getFeaturedJobs() {
  return db.all(
    `SELECT j.id, j.title, j.company, j.location, j.salary_min, j.salary_max, j.job_type, j.workplace_type,
            c.name AS category_name
     FROM jobs j
     LEFT JOIN categories c ON c.id = j.category_id
     WHERE j.status = 'active'
     ORDER BY j.is_featured DESC, j.created_at DESC
     LIMIT 6`
  );
}

async function getRecruiterJobs(recruiterId, query = {}) {
  const { page, limit, offset } = parsePagination(query);
  const params = [];
  const conditions = [`j.recruiter_id = ${addParam(params, recruiterId)}`];

  if (query.status) {
    conditions.push(`j.status = ${addParam(params, query.status)}`);
  }

  if (query.keyword) {
    const keywordCondition = addLikeSearch(params, ["j.title", "j.company", "j.location"], query.keyword);

    if (keywordCondition) {
      conditions.push(keywordCondition);
    }
  }

  const items = await db.all(
    `SELECT j.*, c.name AS category_name,
            (
              SELECT COUNT(*)
              FROM applications a
              WHERE a.job_id = j.id
            ) AS applicant_count
     FROM jobs j
     LEFT JOIN categories c ON c.id = j.category_id
     WHERE ${conditions.join(" AND ")}
     ORDER BY j.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const totalRows = await db.all(
    `SELECT COUNT(*) AS total
     FROM jobs j
     WHERE ${conditions.join(" AND ")}`,
    params
  );

  return {
    items,
    pagination: {
      page,
      limit,
      total: Number(totalRows[0]?.total || 0),
    },
  };
}

async function getApplicantsForJob(jobId, recruiterId) {
  const params = [];
  return db.all(
    `SELECT a.id, a.status, a.cover_letter, a.created_at, a.updated_at,
            u.id AS user_id, u.name, u.email, u.location, u.skills, u.headline,
            r.file_name, r.file_path, r.mime_type
     FROM applications a
     INNER JOIN jobs j ON j.id = a.job_id
     INNER JOIN users u ON u.id = a.user_id
     LEFT JOIN resumes r ON r.user_id = u.id
     WHERE a.job_id = ${addParam(params, jobId)}
       AND j.recruiter_id = ${addParam(params, recruiterId)}
     ORDER BY a.updated_at DESC`,
    params
  );
}

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  getJobs,
  getFeaturedJobs,
  getRecruiterJobs,
  getApplicantsForJob,
};
