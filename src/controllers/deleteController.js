const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { DB_PATH, UPLOADS_PATH } = require("../../constants");

const router = express.Router();

const db = new sqlite3.Database(DB_PATH);

// Handle cat picture deletion
router.delete("/:id", (req, res) => {
  const catId = req.params.id;

  const selectQuery = `SELECT filename FROM cat_pictures WHERE id = ?`;
  db.get(selectQuery, [catId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Cat picture not found" });
    }

    const filePath = `${UPLOADS_PATH}/${row.filename}`;
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
