// router/cats.js

const express = require("express");
const uploadController = require("../controllers/uploadController");
const deleteController = require("../controllers/deleteController");
const updateController = require("../controllers/updateController");
const fetchController = require("../controllers/fetchController");

const router = express.Router();

router.use("/upload", uploadController);
router.use("/delete", deleteController);
router.use("/update", updateController);
router.use("/fetch", fetchController);

module.exports = router;
