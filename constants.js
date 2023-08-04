const path = require("path");

const UPLOADS_PATH = path.join(__dirname, "uploads");

const DB_PATH = path.join(__dirname, "cat_pictures.db");

const PORT = 3000;

module.exports = {
  UPLOADS_PATH,
  DB_PATH,
  PORT,
};
