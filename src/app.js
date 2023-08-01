const express = require("express");
const router = require("./router/router");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./cat_pictures.db");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS cat_pictures (
    id TEXT PRIMARY KEY,
    originalname TEXT,
    filename TEXT
  )
`;

db.run(createTableQuery);

const app = express();
const PORT = 3000;

app.use("/api/cats", router);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
