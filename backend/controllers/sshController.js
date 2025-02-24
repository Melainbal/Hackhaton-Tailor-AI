const { Client } = require("ssh2");

exports.connectToRemote = async (req, res) => {
    const conn = new Client();
    const SSH_CONFIG = {
        host: process.env.SSH_HOST,
        port: process.env.SSH_PORT || 22,
        username: process.env.SSH_USER,
        privateKey: require("fs").readFileSync(process.env.SSH_KEY_PATH)
    };

    console.log("Attempting SSH Connection...");

    conn
    .on("ready", () => {
        console.log("✅ SSH Connection Established!");

        const scriptPath = "hackathon-scripts/spec.py";
        const command = `/opt/conda/bin/python3 ${scriptPath}`;

        console.log(`Running script: ${command}`);

        conn.exec(command, (err, stream) => {
            if (err) {
                console.error("Error executing script:", err);
                return res.status(500).json({ error: "Error executing script", details: err.message });
            }

            let output = "";
            let errorOutput = "";

            stream
                .on("data", (data) => {
                    output += data.toString();
                })
                .on("stderr", (data) => {
                    errorOutput += data.toString();
                    console.error("Python Script STDERR:", data.toString());
                })
                .on("close", (code, signal) => {
                    conn.end();
                    if (code !== 0) {
                        console.error(`Script exited with code ${code}, signal: ${signal}`);
                        console.error("Full STDERR Output:", errorOutput);

                        return res.status(500).json({
                            error: "Script execution failed",
                            exitCode: code,
                            signal,
                            stderr: errorOutput,
                        });
                    } else {
                        console.log("Script executed successfully!");

                        try {
                            const parsedOutput = JSON.parse(output);
                            return res.json({ message: "Specs Retrieved", specs: parsedOutput });
                        } catch (parseError) {
                            console.error("JSON Parse Error:", parseError);
                            return res.json({ message: "Specs Retrieved", rawOutput: output });
                        }
                    }
                });
        });
    })
    .on("error", (err) => {
        console.error("SSH Connection Error:", err);
        res.status(500).json({ error: "SSH Connection Failed", details: err.message });
    })
    .connect(SSH_CONFIG);
};
