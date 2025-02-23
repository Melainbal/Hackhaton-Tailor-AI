const express = require("express");
const router = express.Router();
const { connectToRemote } = require("../controllers/sshController");

// Define SSH API route
router.post("/connect-to-remote", connectToRemote);

module.exports = router;
