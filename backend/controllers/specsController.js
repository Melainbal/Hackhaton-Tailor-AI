const { exec } = require("child_process");

exports.getLocalSpecs = (req, res) => {
    console.log("Executing local system specs script...");

    const pythonScript = "python3 services/machineSpecs.py";

    exec(pythonScript, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).json({ error: "Failed to execute local specs script." });
        }
        if (stderr) {
            console.error(`Script stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        try {
            const parsedData = JSON.parse(stdout);
            console.log("Full API JSON Data:", JSON.stringify(parsedData, null, 2));
            res.json(parsedData);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            res.status(500).json({ error: "Invalid JSON output from script." });
        }
    });
};
