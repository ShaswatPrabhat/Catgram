const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3");
const { DB_PATH, UPLOADS_PATH } = require("../../constants");

const router = express.Router();
const db = new sqlite3.Database(DB_PATH);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4() + "-" + file.originalname;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/cats/upload/:
 *   post:
 *     summary: Upload a cat picture.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               catImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Cat picture uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the uploaded cat picture.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Bad request - No cat picture uploaded.
 *       500:
 *         description: Internal server error - Failed to save cat picture information.
 */

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
