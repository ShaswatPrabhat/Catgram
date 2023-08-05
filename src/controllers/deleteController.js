const express = require("express");
const { UPLOADS_PATH } = require("../../constants");
const { db, selectQuery, deleteQuery } = require("../repository/catRepository");
const { deleteFile } = require("../fsBlob/blob");

const router = express.Router();

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

  db.get(selectQuery, [catId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: "Cat picture not found" });
    }

    const filePath = `${UPLOADS_PATH}/${row.filename}`;
    deleteFile(filePath);

    db.run(deleteQuery, [catId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete cat picture" });
      }
      res.json({ message: "Cat picture deleted successfully!" });
    });
  });
});

module.exports = router;
