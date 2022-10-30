const fsPromise = require("fs/promises");
const fs = require("fs");
const path = require("node:path");
const { stdout } = require("process");

async function createBundle() {
  const files = await fsPromise.readdir(path.join(__dirname, "styles"));
  const cssFiles = [];

  const writableStream = fs.createWriteStream(path.join(__dirname, "project-dist", "bundle.css"));


    for (let i = 0; i < files.length; i++) {
      const stats = await fsPromise.stat(path.join(__dirname, "styles", files[i]));
      if (stats.isFile() && path.parse(files[i]).ext === ".css") {
        const readableStream = fs.createReadStream(path.join(__dirname, "styles", files[i]), "utf-8");
        readableStream.on("data", (data) => writableStream.write(data));
      }
  }
}

createBundle();