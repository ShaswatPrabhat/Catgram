const express = require("express");
const router = require("./src/router/router");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const morgan = require("morgan");
const { DB_PATH, PORT } = require("./constants");
const { specs, swaggerUi } = require("./config/swagger");

const db = new sqlite3.Database(DB_PATH);

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS cat_pictures (
    id TEXT PRIMARY KEY,
    originalname TEXT,
    filename TEXT
  )
`;

db.run(createTableQuery);

const app = express();

// Serve static files from the 'site' folder
app.use(express.static(path.join(__dirname, "site")));

// Handle requests for the root path ('/')
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "site", "index.html"));
});

app.use("/api/cats", router);
app.use(morgan("dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = server; // Export the app instance
