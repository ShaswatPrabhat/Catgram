const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = 3000; // You can change this to any desired port number

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Destination folder where cat pictures will be stored
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4() + "-" + file.originalname;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

// app.js

// Upload a cat pic
app.post("/api/cats", upload.single("catImage"), (req, res) => {
  // Logic to handle the uploaded cat picture
  // You can save the file information or do any additional processing here

  res.status(201).json({ message: "Cat picture uploaded successfully!" });
});

// Delete a cat pic
app.delete("/api/cats/:id", (req, res) => {
  const catId = req.params.id;
  // Logic to delete the cat picture with the given ID
  // Handle the case if the cat picture with the given ID doesn't exist

  res.json({ message: "Cat picture deleted successfully!" });
});

// Update a cat pic
app.put("/api/cats/:id", upload.single("catImage"), (req, res) => {
  const catId = req.params.id;
  // Logic to update the cat picture with the given ID
  // Handle the case if the cat picture with the given ID doesn't exist

  res.json({ message: "Cat picture updated successfully!" });
});

// Fetch a particular cat image file by its ID
app.get("/api/cats/:id", (req, res) => {
  const catId = req.params.id;
  // Logic to fetch the cat picture with the given ID
  // Handle the case if the cat picture with the given ID doesn't exist

  // For simplicity, you can just return the file path or URL of the cat picture
  res.json({ filePath: `/uploads/${catId}-cat.jpg` });
});

// Fetch a list of the uploaded cat pics
app.get("/api/cats", (req, res) => {
  // Logic to fetch a list of all uploaded cat pictures
  // You can return an array of cat picture information (e.g., file paths or URLs)

  res.json({ catPictures: [] });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
