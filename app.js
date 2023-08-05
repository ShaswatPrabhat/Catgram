const express = require("express");
const router = require("./src/router/router");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const morgan = require("morgan");
const basicAuth = require("express-basic-auth");
const { DB_PATH, PORT } = require("./constants");
const { specs, swaggerUi } = require("./config/swagger");
const { createTableQuery } = require("./src/utils/db");

const db = new sqlite3.Database(DB_PATH);

db.run(createTableQuery);

const app = express();

app.use(express.static(path.join(__dirname, "site")));
app.use(morgan("dev"));

const authDetails = {
  users: { cat: "meow" },
  challenge: true,
};

app.use(basicAuth(authDetails));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "site", "index.html"));
});
app.use("/api/cats", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = server;
