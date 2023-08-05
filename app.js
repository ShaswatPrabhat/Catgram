const express = require("express");
const router = require("./src/router/router");
const path = require("path");
const morgan = require("morgan");
const basicAuth = require("express-basic-auth");
const { PORT } = require("./constants");
const { specs, swaggerUi } = require("./config/swagger");
const { db, createTableQuery } = require("./src/repository/catRepository");
const { MulterError } = require("multer");

db.run(createTableQuery);
const app = express();

app.use(express.static(path.join(__dirname, "site")));
app.use(morgan("dev"));

const authDetails = {
  users: { cat: "meow" },
  challenge: true,
};

app.use(basicAuth(authDetails));
app.use((err, req, res, next) => {
  if (err instanceof MulterError) {
    // Multer error (e.g., file size exceeded, unsupported file type)
    return res
      .status(400)
      .json({ message: "File upload error: " + err.message });
  }
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "site", "index.html"));
});
app.use("/api/cats", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = server;
