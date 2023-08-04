// constants.js

const path = require("path");

// Define the path for uploads
const UPLOADS_PATH = path.join(__dirname, "uploads");

// Create the database connection
const DB_PATH = path.join(__dirname, "cat_pictures.db");

const PORT = 3000;

module.exports = {
  UPLOADS_PATH,
  DB_PATH,
  PORT,
};
