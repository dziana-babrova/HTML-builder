const fs = require("fs");
const path = require("node:path");
const { stdout } = require("process");

fs.mkdir(path.join(__dirname, "files-copy"), { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(path.join(__dirname, "files"), { withFileTypes: false }, (err, files) => {
  if (err) throw new Error("Something went wrong");
  else {
    for (let i = 0; i < files.length; i++) {
      try {
          copyFile(files[i], path.join(__dirname, "files-copy", files[i]));
          console.log('source.txt was copied to destination.txt');
        } catch {
          console.log('The file could not be copied');
      }
    };
  }
});