const fs = require("fs");
const path = require("node:path");
const { stdout } = require("process");

fs.readdir(path.join(__dirname, "secret-folder"), { withFileTypes: false }, (err, files) => {
  if (err) throw new Error("Something went wrong");
  else {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, "secret-folder", file), (error, stats) => {
        if (error) {
          throw new Error("Something went wrong");
        } else {
          if (stats.isFile()) {
            stdout.write(`${path.parse(file).name} - ${path.parse(file).ext.slice(1)} - ${stats.size / 1000}Kb\n`);
          }
        }
      });
    });
  }
});