const fsPromise = require("fs/promises");
const fs = require("fs");
const path = require("node:path");

const pathToInputDirectory = path.join(__dirname, "styles");
const pathToBundleFile = path.join(__dirname, "project-dist", "bundle.css");

async function createBundle() {
  const files = await fsPromise.readdir(pathToInputDirectory);

  const writableStream = fs.createWriteStream(pathToBundleFile);


    for (let i = 0; i < files.length; i++) {
      const stats = await fsPromise.stat(path.join(pathToInputDirectory, files[i]));
      if (stats.isFile() && path.parse(files[i]).ext === ".css") {
        const readableStream = fs.createReadStream(path.join(pathToInputDirectory, files[i]), "utf-8");
        readableStream.on("data", (data) => writableStream.write(data));
      }
  }
}

createBundle();