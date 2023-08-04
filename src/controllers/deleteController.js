const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, "../../cat_pictures.db"));

// Handle cat picture deletion
router.delete("/:id", (req, res) => {
  const catId = req.params.id;

  const selectQuery = `SELECT filename FROM cat_pictures WHERE id = ?`;
  db.get(selectQuery, [catId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Cat picture not found" });
    }

    const filePath = `${path.join(__dirname, "../../uploads")}/${row.filename}`;
    fs.unlinkSync(filePath);

    const deleteQuery = `DELETE FROM cat_pictures WHERE id = ?`;
    db.run(deleteQuery, [catId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete cat picture" });
      }
      res.json({ message: "Cat picture deleted successfully!" });
    });
  });
});

module.exports = router;
