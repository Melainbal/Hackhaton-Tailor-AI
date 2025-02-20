const express = require("express");
const path = require("path"); 
const cors = require("cors");
const { Client } = require("ssh2");
const fs = require("fs");
const FormData = require("form-data");
const fetch = require("node-fetch");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Load credentials from .env
const SSH_CONFIG = {
    host: process.env.SSH_HOST,
    port: 22,
    username: process.env.SSH_USER,
    privateKey: fs.readFileSync(process.env.SSH_KEY_PATH),
};

// API to connect to the remote machine via SSH and retrieve system specs
app.post("/api/connect-to-remote", async (req, res) => {
    const conn = new Client();
  
    conn
      .on("ready", () => {
        console.log("SSH Connection Established!");
  
        // Run script on the remote machine
        conn.exec("bash -c 'lscpu; free -h; uname -a'", (err, stream) => {
          if (err) {
            res.status(500).json({ error: "Error executing command" });
            return;
          }
  
          let output = "";
  
          stream
            .on("data", (data) => {
              output += data.toString();
            })
            .on("close", () => {
              conn.end();
              res.json({ message: "Specs Retrieved", specs: output });
            });
        });
      })
      .on("error", (err) => {
        console.error("SSH Connection Error:", err);
        res.status(500).json({ error: "SSH Connection Failed" });
      })
      .connect(SSH_CONFIG);
  });

// Blueprint Upload API
app.post("/api/upload-blueprint", async (req, res) => {
    try {
      const apiUrl = process.env.DSP_MANAGER_URL;
      const token = process.env.DSP_MANAGER_TOKEN;
      const blueprintName = "AI_Solution";
      const blueprintFile = "blueprint.yaml";
  
      if (!apiUrl || !token) {
        return res.status(500).json({ error: "Missing API URL or Token" });
      }
  
      // Ensure blueprint.yaml exists
      const blueprintPath = path.join(__dirname, "blueprints", blueprintFile);
      if (!fs.existsSync(blueprintPath)) {
        return res.status(400).json({ error: "Blueprint file not found" });
      }
  
      // Create form-data for the request
      const formData = new FormData();
      formData.append("params", JSON.stringify({
        visibility: "tenant",
        version: "1.0.0",
        application_file_name: blueprintFile
      }));
      formData.append("blueprint_archive", fs.createReadStream(blueprintPath));
  
      // Set headers for Fusion
      const headers = {
        "Authentication-Token": token,
        "tenant": "default_tenant"
      };
  
      const response = await fetch(`${apiUrl}/api/v3.1/blueprints/${blueprintName}`, {
        method: "PUT",
        headers: headers,
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({ error: errorData.messages[0].message });
      }
  
      return res.status(200).json({ message: "Blueprint uploaded successfully!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});