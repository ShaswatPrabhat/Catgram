const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3");
const { v4: uuidv4 } = require("uuid");
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
 * /api/cats/update/{id}:
 *   put:
 *     summary: Update a previously uploaded cat picture (not just metadata) in place.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cat picture to update.
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
 *       200:
 *         description: Cat picture updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the updated cat picture.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Bad request - No cat picture uploaded for update.
 *       404:
 *         description: Cat picture not found for update.
 *       500:
 *         description: Internal server error - Failed to update cat picture.
 */
router.put("/:id", upload.single("catImage"), (req, res) => {
  const catId = req.params.id;
  const originalname = req.file.originalname;
  const filename = req.file.filename;

  const selectQuery = `SELECT filename FROM cat_pictures WHERE id = ?`;
  db.get(selectQuery, [catId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Cat picture not found" });
    }

    const oldFilePath = `${UPLOADS_PATH}/${row.filename}`;
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
