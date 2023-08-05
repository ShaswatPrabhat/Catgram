const sqlite3 = require("sqlite3");
const { DB_PATH } = require("../../constants");
const catRepository = new sqlite3.Database(DB_PATH);

const insertQuery = `
    INSERT INTO cat_pictures (id, originalname, filename)
    VALUES (?, ?, ?)
  `;

const selectQuery = `SELECT filename FROM cat_pictures WHERE id = ?`;

const deleteQuery = `DELETE FROM cat_pictures WHERE id = ?`;

const selectAllQuery = `SELECT * FROM cat_pictures`;

const updateQuery = `UPDATE cat_pictures SET originalname = ?, filename = ? WHERE id = ?`;

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS cat_pictures (
    id TEXT PRIMARY KEY,
    originalname TEXT,
    filename TEXT
  )
`;

module.exports = {
  db: catRepository,
  insertQuery,
  selectQuery,
  deleteQuery,
  selectAllQuery,
  updateQuery,
  createTableQuery,
};
