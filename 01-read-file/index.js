const fs = require("fs");
const path = require("node:path");

const { stdout } = process;

const pathToFile = path.join(__dirname, "text.txt");

const readableStream = fs.createReadStream(pathToFile, "utf-8");

readableStream.on("error", (error) => console.log("Error", error.message));
readableStream.on("data", (data) => stdout.write(data));