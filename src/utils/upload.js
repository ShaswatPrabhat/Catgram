const multer = require("multer");
const { UPLOADS_PATH } = require("../../constants");
const { v4: uuidv4 } = require("uuid");

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

const uploadSingleCatImage = upload.single("catImage");

module.exports = { upload, uploadSingleCatImage };
