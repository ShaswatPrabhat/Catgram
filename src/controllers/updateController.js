const express = require("express");
const { UPLOADS_PATH } = require("../../constants");
const { db, selectQuery, updateQuery } = require("../utils/db");
const { unlinkSync } = require("fs");
const { uploadSingleCatImage } = require("../utils/upload");

const router = express.Router();

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
router.put("/:id", uploadSingleCatImage, (req, res) => {
  const catId = req.params.id;
  const originalname = req.file.originalname;
  const filename = req.file.filename;

  db.get(selectQuery, [catId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Cat picture not found" });
    }

    const oldFilePath = `${UPLOADS_PATH}/${row.filename}`;
    unlinkSync(oldFilePath);

    db.run(updateQuery, [originalname, filename, catId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update cat picture" });
      }
      res.json({ message: "Cat picture updated successfully!" });
    });
  });
});

module.exports = router;
