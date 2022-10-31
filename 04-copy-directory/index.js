const fsPromise = require("fs/promises");
const fs = require("fs");
const path = require("node:path");
const { stdout } = require("process");

const pathToInputDirectory = path.join(__dirname, "files");
const pathToOutputDirectory = path.join(__dirname, "files-copy");

createDir();
copyDir(pathToInputDirectory, pathToOutputDirectory);

async function createDir() {
  await fsPromise.mkdir(pathToOutputDirectory, { recursive: true }, (err) => {
    if (err) throw err;
  });
}


async function copyDir(pathToInputDirectory, pathToOutputDirectory) {
  const filesCreated = await fsPromise.readdir(path.join(pathToOutputDirectory));

  for (let i = 0; i < filesCreated.length; i++) {
    const stats = await fsPromise.stat(path.join(pathToInputDirectory, filesCreated[i]));
    if (stats.isFile()) {
      await fsPromise.unlink(path.join(pathToOutputDirectory, filesCreated[i]));
    } else {
      await fsPromise.rmdir(path.join(pathToOutputDirectory, filesCreated[i]));
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