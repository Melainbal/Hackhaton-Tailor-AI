const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

exports.createZipFile = (blueprintPath) => {
    return new Promise((resolve, reject) => {
        const zipFilePath = path.join(__dirname, "../blueprints", "blueprint.zip");

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
        archive.file(blueprintPath, { name: "blueprint.yaml" });
        archive.finalize();
    });
};
