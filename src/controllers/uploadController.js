const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { db, insertQuery } = require("../repository/catRepository");
const { uploadSingleCatImage } = require("../fsBlob/upload");

const router = express.Router();

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

router.post("/", uploadSingleCatImage, (req, res) => {
  const catId = uuidv4();
  const originalname = req.file.originalname;
  const filename = req.file.filename;

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
