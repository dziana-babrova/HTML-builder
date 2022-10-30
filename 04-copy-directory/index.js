const fsPromise = require("fs/promises");
const fs = require("fs");
const path = require("node:path");
const { stdout } = require("process");

createDir(__dirname, "files", "files-copy");
copyDir(__dirname, "files", "files-copy");

async function createDir(readDirectoryPath, readDirectoryName, copyName) {
  await fsPromise.mkdir(path.join(readDirectoryPath, copyName), { recursive: true }, (err) => {
    if (err) throw err;
  });
}

async function copyDir(readDirectoryPath, readDirectoryName, copyName) {

  const filesCreated = await fsPromise.readdir(path.join(readDirectoryPath, copyName));

  for (let i = 0; i < filesCreated.length; i++) {
    const stats = await fsPromise.stat(path.join(readDirectoryPath, readDirectoryName, filesCreated[i]));
    if (stats.isFile()) {
      await fsPromise.unlink(path.join(readDirectoryPath, copyName, filesCreated[i]));
    } else {
      await fsPromise.rmdir(path.join(readDirectoryPath, copyName, filesCreated[i]));
    }
  }

  const files = await fsPromise.readdir(path.join(readDirectoryPath, readDirectoryName));
  for (let i = 0; i < files.length; i++) {
    const stats = await fsPromise.stat(path.join(readDirectoryPath, readDirectoryName, files[i]));
    if (stats.isDirectory()) {
      await fsPromise.mkdir(path.resolve(__dirname, copyName, files[i]), { recursive: true }, (err) => {
        if (err) throw err;
      });
    } else {
      await fsPromise.copyFile(
        path.join(readDirectoryPath, readDirectoryName, files[i]),
        path.resolve(readDirectoryPath, copyName, files[i])
      );
    }
  }
  stdout.write("The files has been copied successfully");
}