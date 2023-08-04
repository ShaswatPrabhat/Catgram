const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, "../../cat_pictures.db"));

router.get("/:id", (req, res) => {
  const catId = req.params.id;

  const selectQuery = `SELECT filename FROM cat_pictures WHERE id = ?`;
  db.get(selectQuery, [catId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Cat picture not found" });
    }

    const filePath = `${path.join(__dirname, "../../uploads")}/${row.filename}`;

    res.sendFile(filePath);
  });
});

router.get("/", (req, res) => {
  const selectAllQuery = `SELECT * FROM cat_pictures`;
  db.all(selectAllQuery, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch cat pictures" });
    }

    const catPictures = rows.map((row) => ({
      id: row.id,
      originalname: row.originalname,
      filename: row.filename,
      filePath: `${path.join(__dirname, "../../uploads")}/${row.filename}`,
    }));

    res.json({ catPictures });
  });
});

module.exports = router;
