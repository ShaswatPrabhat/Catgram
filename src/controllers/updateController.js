const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const db = new sqlite3.Database("../cat_pictures.db");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4() + "-" + file.originalname;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

router.put("/:id", upload.single("catImage"), (req, res) => {
  const catId = req.params.id;
  const originalname = req.file.originalname;
  const filename = req.file.filename;

  const selectQuery = `SELECT filename FROM cat_pictures WHERE id = ?`;
  db.get(selectQuery, [catId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Cat picture not found" });
    }

    const oldFilePath = `./uploads/${row.filename}`;
    fs.unlinkSync(oldFilePath);

    const updateQuery = `UPDATE cat_pictures SET originalname = ?, filename = ? WHERE id = ?`;
    db.run(updateQuery, [originalname, filename, catId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update cat picture" });
      }
      res.json({ message: "Cat picture updated successfully!" });
    });
  });
});

module.exports = router;
