const express = require("express");
const { UPLOADS_PATH } = require("../../constants");
const { db, selectQuery, selectAllQuery} = require("../utils/db");

const router = express.Router();

/**
 * @swagger
 * /api/cats/fetch/{id}:
 *   get:
 *     summary: Fetch a particular cat picture by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cat picture.
 *     responses:
 *       200:
 *         description: Cat picture fetched successfully.
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Cat picture not found.
 *       500:
 *         description: Internal server error - Failed to fetch cat picture.
 */
router.get("/:id", (req, res) => {
  const catId = req.params.id;

  db.get(selectQuery, [catId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Cat picture not found" });
    }

    const filePath = `${UPLOADS_PATH}/${row.filename}`;

    res.sendFile(filePath);
  });
});

/**
 * @swagger
 * /api/cats/fetch/:
 *   get:
 *     summary: Fetch all cats data.
 *     responses:
 *       200:
 *         description: Cat details fetched successfully.
 *       404:
 *         description: Cat picture not found.
 *       500:
 *         description: Internal server error - Failed to fetch cat picture.
 */
router.get("/", (req, res) => {
  db.all(selectAllQuery, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch cat pictures" });
    }

    const catPictures = rows.map((row) => ({
      id: row.id,
      originalname: row.originalname,
      filename: row.filename,
      filePath: `${UPLOADS_PATH}/${row.filename}`,
    }));

    res.json({ catPictures });
  });
});

module.exports = router;
