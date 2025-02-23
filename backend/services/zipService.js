const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

exports.createZipFile = (blueprintPath) => {
    return new Promise((resolve, reject) => {
        const blueprintDir = path.join(__dirname, "../blueprints/AI_Solution"); // Path to AI_Solution directory
        const zipFilePath = path.join(__dirname, "../blueprints", "AI_Solution.zip"); // Path for the ZIP file
    
        if (!fs.existsSync(blueprintDir)) {
            console.error("Error: AI_Solution directory does not exist!", blueprintDir);
            reject(new Error("Blueprint directory not found"));
            return;
        }
    
        if (!fs.existsSync(path.dirname(zipFilePath))) {
            fs.mkdirSync(path.dirname(zipFilePath), { recursive: true });
        }
    
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver("zip", { zlib: { level: 9 } });
    
        output.on("close", () => {
            console.log(`ZIP file created: ${zipFilePath} (${archive.pointer()} bytes)`);
            resolve(zipFilePath);
        });
    
        archive.on("error", (err) => {
            console.error("Error creating ZIP file:", err);
            reject(err);
        });
    
        archive.pipe(output);
        archive.directory(blueprintDir, "AI_Solution");
    
        archive.finalize();
    });    
};
