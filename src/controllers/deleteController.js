const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { DB_PATH, UPLOADS_PATH } = require("../../constants");

const router = express.Router();

const db = new sqlite3.Database(DB_PATH);

/**
 * @swagger
 * /api/cats/delete/{id}:
 *   delete:
 *     summary: Delete a cat picture by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cat picture to delete.
 *     responses:
 *       200:
 *         description: Cat picture deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       404:
 *         description: Cat picture not found for deletion.
 *       500:
 *         description: Internal server error - Failed to delete cat picture.
 */
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
