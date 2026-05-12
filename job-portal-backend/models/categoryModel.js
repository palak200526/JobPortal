const db = require("../config/db");

async function getAllCategories() {
  return db.all("SELECT id, name FROM categories ORDER BY name ASC");
}

module.exports = {
  getAllCategories,
};
