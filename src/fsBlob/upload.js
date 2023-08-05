const multer = require("multer");
const { UPLOADS_PATH } = require("../../constants");
const { v4: uuidv4 } = require("uuid");
const { unlinkSync } = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueFileName = uuidv4() + "-" + file.originalname;
    cb(null, uniqueFileName);
  },
});

const uploadSingleCatImage = multer({ storage: storage }).single("catImage");

const deleteFile = (path) => unlinkSync(path);

module.exports = { deleteFile, uploadSingleCatImage };
