const express = require("express");
const router = express.Router();
const { connectToRemote } = require("../controllers/sshController");
const { getLocalSpecs } = require("../controllers/specsController");

// Route for connecting to a remote machine via SSH
router.post("/connect-to-remote", connectToRemote);

// Route for getting local machine specs
router.get("/get-local-specs", getLocalSpecs);

module.exports = router;
