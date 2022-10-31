const fs = require("fs");
const path = require("node:path");
const readline = require("readline");
const { stdin: input, stdout: output, argv } = require("process");

const rl = readline.createInterface({ input, output });

const pathToFile = path.join(__dirname, "text.txt");

const writableStream = fs.createWriteStream(pathToFile);

output.write("Hi, my dear frield! Enter your notes here:\n");

rl.on("line", (argv) => {
  if (argv === "exit") {
    rl.close();
  } else {
    writableStream.write(argv);
    writableStream.write("\n");
  }
});

rl.on("close", () => { output.write("See you again soon!") });