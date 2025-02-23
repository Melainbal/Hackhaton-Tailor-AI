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
            console.log("SSH Connection Established!");

            // Run commands on remote machine
            conn.exec("bash -c 'lscpu; free -h; uname -a'", (err, stream) => {
                if (err) {
                    console.error("Error executing SSH command:", err);
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
                        console.log("Specs Retrieved Successfully!");
                        res.json({ message: "Specs Retrieved", specs: output });
                    });
            });
        })
        .on("error", (err) => {
            console.error("SSH Connection Error:", err);
            res.status(500).json({ error: "SSH Connection Failed" });
        })
        .connect(SSH_CONFIG);
};
