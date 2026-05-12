const mysql = require("mysql2/promise");
const { Pool } = require("pg");

const { mysqlSchemaStatements, postgresSchemaStatements, categorySeedData } = require("./schema");

const dialect = (process.env.DB_CLIENT || "mysql").toLowerCase() === "postgres" ? "postgres" : "mysql";

let pool;

function getPool() {
  if (pool) {
    return pool;
  }

  if (dialect === "postgres") {
    pool = new Pool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "aurajobs",
      port: Number(process.env.DB_PORT || 5432),
      max: Number(process.env.DB_POOL_MAX || 10),
      idleTimeoutMillis: 30000,
    });
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Khushi!@#123",
    database: process.env.DB_NAME || "aurajobs",
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_POOL_MAX || 10),
    queueLimit: 0,
  });

  return pool;
}

function placeholder(index) {
  return dialect === "postgres" ? `$${index}` : "?";
}

function placeholders(count, start = 1) {
  return Array.from({ length: count }, (_, index) => placeholder(start + index)).join(", ");
}

async function all(sql, params = []) {
  const activePool = getPool();

  if (dialect === "postgres") {
    const result = await activePool.query(sql, params);
    return result.rows;
  }

  const [rows] = await activePool.execute(sql, params);
  return rows;
}

async function one(sql, params = []) {
  const rows = await all(sql, params);
  return rows[0] || null;
}

async function run(sql, params = []) {
  const activePool = getPool();

  if (dialect === "postgres") {
    return activePool.query(sql, params);
  }

  const [result] = await activePool.execute(sql, params);
  return result;
}

async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (!keys.length) {
    throw new Error("Insert requires at least one column");
  }

  const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders(keys.length)})`;

  if (dialect === "postgres") {
    const result = await run(`${sql} RETURNING *`, values);
    return result.rows[0];
  }

  const result = await run(sql, values);
  return { id: result.insertId, ...data };
}

async function update(table, data, whereClause, whereParams = []) {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (!keys.length) {
    throw new Error("Update requires at least one column");
  }

  const setClause = keys
    .map((key, index) => `${key} = ${placeholder(index + 1)}`)
    .join(", ");

  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

  if (dialect === "postgres") {
    return run(sql, [...values, ...whereParams]);
  }

  return run(sql, [...values, ...whereParams]);
}

async function remove(table, whereClause, whereParams = []) {
  return run(`DELETE FROM ${table} WHERE ${whereClause}`, whereParams);
}

async function initializeDatabase() {
  const statements = dialect === "postgres" ? postgresSchemaStatements : mysqlSchemaStatements;

  for (const statement of statements) {
    try {
      await run(statement);
    } catch (error) {
      if (dialect === "mysql" && error.code === "ER_DUP_KEYNAME") {
        continue;
      }

      throw error;
    }
  }

  const existingCategories = await all("SELECT name FROM categories");
  const existing = new Set(existingCategories.map((item) => item.name.toLowerCase()));

  for (const categoryName of categorySeedData) {
    if (!existing.has(categoryName.toLowerCase())) {
      await insert("categories", { name: categoryName });
    }
  }
}

async function closeDatabase() {
  if (!pool) {
    return;
  }

  await pool.end();
}

module.exports = {
  all,
  one,
  run,
  insert,
  update,
  remove,
  initializeDatabase,
  closeDatabase,
  dialect,
  placeholder,
  placeholders,
};
