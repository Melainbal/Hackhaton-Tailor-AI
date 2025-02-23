const express = require("express");
const router = express.Router();
const { uploadBlueprint } = require("../controllers/blueprintController");

// Route for uploading a blueprint
router.post("/upload-blueprint", uploadBlueprint);

module.exports = router;
