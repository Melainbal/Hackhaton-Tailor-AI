const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { createZipFile } = require("../services/zipService");

exports.uploadBlueprint = async (req, res) => {
    try {
        console.log("Received request to upload blueprint...");
        const apiUrl = process.env.DSP_MANAGER_URL;
        const token = process.env.DSP_MANAGER_TOKEN;
        const blueprintFolder = path.join(__dirname, "../blueprints/AI_Solution");

        if (!apiUrl || !token) {
            console.error("Missing API URL or Token");
            return res.status(500).json({ error: "Missing API URL or Token" });
        }

        if (!fs.existsSync(blueprintFolder)) {
            console.error("Blueprint folder not found:", blueprintFolder);
            return res.status(400).json({ error: "Blueprint file not found" });
        }

        console.log("Creating ZIP archive...");
        const zipFilePath = await createZipFile(blueprintFolder);

        // Prepare FormData for upload
        const formData = new FormData();
        formData.append("params", JSON.stringify({
            visibility: "tenant",
            version: "1.0.0",
            application_file_name: "blueprint.yaml" 
        }));
        formData.append("blueprint_archive", fs.createReadStream(zipFilePath));

        // Set headers
        const headers = { "Authentication-Token": token, "tenant": "default_tenant" };

        console.log(`Sending PUT request to ${apiUrl}/api/v3.1/blueprints/AI_Solution`);
        const response = await fetch(`${apiUrl}/api/v3.1/blueprints/AI_Solution`, {
            method: "PUT",
            headers: headers,
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Upload failed:", errorData);
            return res.status(response.status).json({ error: errorData.messages[0].message });
        }

        console.log("Blueprint uploaded successfully!");
        return res.status(200).json({ message: "Blueprint uploaded successfully!" });
    } catch (error) {
        console.error("Exception caught:", error);
        return res.status(500).json({ error: error.message });
    }
};
