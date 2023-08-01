const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const app = express();
const PORT = 3000;

const catPictures = [];

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

app.post("/api/cats", upload.single("catImage"), (req, res) => {
  const catId = uuidv4();

  const newCatPicture = {
    id: catId,
    originalName: req.file.originalName,
    filename: req.file.filename,
  };
  catPictures.push(newCatPicture);

  res
    .status(201)
    .json({ id: catId, message: "Cat picture uploaded successfully!" });
});

app.delete("/api/cats/:id", (req, res) => {
  const catId = req.params.id;

  const catPictureIndex = catPictures.findIndex((cat) => cat.id === catId);

  if (catPictureIndex === -1) {
    return res.status(404).json({ error: "Cat picture not found" });
  }

  const catPicture = catPictures[catPictureIndex];

  const filePath = `./uploads/${catPicture.filename}`;
  fs.unlinkSync(filePath);

  catPictures.splice(catPictureIndex, 1);

  res.json({ message: "Cat picture deleted successfully!" });
});

app.put("/api/cats/:id", upload.single("catImage"), (req, res) => {
  const catId = req.params.id;

  const catPictureIndex = catPictures.findIndex((cat) => cat.id === catId);

  if (catPictureIndex === -1) {
    return res.status(404).json({ error: "Cat picture not found" });
  }

  const catPicture = catPictures[catPictureIndex];

  const oldFilePath = `./uploads/${catPicture.filename}`;
  fs.unlinkSync(oldFilePath);

  catPicture.originalname = req.file.originalname;
  catPicture.filename = req.file.filename;

  res.json({ message: "Cat picture updated successfully!" });
});

app.get("/api/cats/:id", (req, res) => {
  const catId = req.params.id;

  const catPicture = catPictures.find((cat) => cat.id === catId);

  if (!catPicture) {
    return res.status(404).json({ error: "Cat picture not found" });
  }

  res.json({ filePath: `/uploads/${catPicture.filename}` });
});

app.get("/api/cats", (req, res) => {
  res.json({ catPictures });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
