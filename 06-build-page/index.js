const fsPromise = require("fs/promises");
const fs = require("fs");
const path = require("node:path");
const { stdout } = require("process");

const destination = path.join(__dirname, "project-dist");
const pathToInputDirectory = path.join(__dirname, "styles");
const pathToBundleFile = path.join(__dirname, "project-dist", "style.css");
const pathToAssets = path.join(__dirname, "assets");
const pathToCopiedAssets = path.join(destination, "assets");

(async function createDist() {
  await createDir();
  await createHtml();
  await createBundle();
  await createAssetsDir();
  await copyDir(pathToAssets, pathToCopiedAssets);
})()

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

async function createDir() {
  await removeDir(destination);

  await fsPromise.mkdir(destination, { recursive: true }, (err) => {
    if (err) throw err;
  });
}


async function createHtml() {
  const pathToHtml = path.join(__dirname, "template.html");
  const pathToFinalHtml = path.join(destination, "index.html");

  const components = await fsPromise.readdir(path.join(__dirname, "components"));

  const readableStream = fs.createReadStream(pathToHtml);
  const writableStream = fs.createWriteStream(pathToFinalHtml);
  readableStream.on("data", function (dataFromMainStream) {
    components.forEach(async (item, index) => {
      const dataFromStream = fs.createReadStream(path.join(__dirname, "components", `${item}`));
      dataFromStream.on("data", (data) => {
        dataFromMainStream = dataFromMainStream.toString().replace(`{{${path.parse(item).name}}}`, data);
        if (index === components.length - 1) {
          writableStream.write(dataFromMainStream);
        }
      })
    })
  });
}

async function createAssetsDir() {
  await fsPromise.mkdir(pathToCopiedAssets, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

async function copyDir(pathToInputDirectory, pathToOutputDirectory) {
  const filesCreated = await fsPromise.readdir(path.join(pathToOutputDirectory));

  if (filesCreated > 0) {
    for (let i = 0; i < filesCreated.length; i++) {
      const stats = await fsPromise.stat(path.join(pathToOutputDirectory, filesCreated[i]));
      if (stats.isFile()) {
        await fsPromise.unlink(path.join(pathToOutputDirectory, filesCreated[i]));
      } else {
        await removeDir(path.join(pathToOutputDirectory, filesCreated[i]));
      }
    }
  }

  const files = await fsPromise.readdir(path.join(pathToInputDirectory));
  for (let i = 0; i < files.length; i++) {
    const stats = await fsPromise.stat(path.join(pathToInputDirectory, files[i]));
    if (stats.isDirectory()) {
      await fsPromise.mkdir(path.resolve(pathToOutputDirectory, files[i]), { recursive: true }, (err) => {
        if (err) throw err;
      });
      const newpathToInputDirectory = path.join(pathToInputDirectory, files[i]);
      const newPathToOutpoutDirectory = path.join(pathToOutputDirectory, files[i]);
      copyDir(newpathToInputDirectory, newPathToOutpoutDirectory);
    } else {
      await fsPromise.copyFile(
        path.join(pathToInputDirectory, files[i]),
        path.resolve(pathToOutputDirectory, files[i])
      );
    }
  }
}

async function removeDir(folder) {
  if (
    fs.access(folder, function (error) {
    })
  ) {
    const files = await fsPromise.readdir(path.join(folder));
    for (let i = 0; i < files.length; i++) {
      const stats = await fsPromise.stat(path.join(folder, files[i]));
      if (stats.isDirectory()) {
        const directoryFiles = await fsPromise.readdir(path.join(pathToInputDirectory));
        if (directoryFiles.length > 0) {
          const newFolder = path.join(folder, files[i]);
          removeDir(newFolder);
        } else {
          await fsPromise.rmdir(folder, files[i]);
        }
      } else {
        await fsPromise.unlink(path.join(folder, files[i]));
      }
    }
  }
}