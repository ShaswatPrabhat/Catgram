const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3");
const path = require("path");

const router = express.Router();
const db = new sqlite3.Database(path.join(__dirname, "../../cat_pictures.db"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads")); // Destination folder where cat pictures will be stored
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4() + "-" + file.originalname;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("catImage"), (req, res) => {
  const catId = uuidv4();
  const originalname = req.file.originalname;
  const filename = req.file.filename;

  const insertQuery = `
    INSERT INTO cat_pictures (id, originalname, filename)
    VALUES (?, ?, ?)
  `;
  db.run(insertQuery, [catId, originalname, filename], (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to upload cat picture" });
    }
    res
      .status(201)
      .json({ id: catId, message: "Cat picture uploaded successfully!" });
  });
});

module.exports = router;
