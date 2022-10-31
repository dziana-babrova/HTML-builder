const fs = require("fs/promises");
const path = require("node:path");
const { stdout } = require("process");

async function readDir() {
  try {
    const data = await fs.readdir(path.join(__dirname, "secret-folder"));
    for (let i = 0; i < data.length; i++) {
      const stats = await fs.stat(path.join(__dirname, "secret-folder", data[i]));
      if (stats.isFile()) {
        stdout.write(`${path.parse(data[i]).name} - ${path.parse(data[i]).ext.slice(1)} - ${stats.size / 1000}Kb\n`);
      }
    }
  } catch {
    throw new Error("Something went wrong");
  }
}

readDir();