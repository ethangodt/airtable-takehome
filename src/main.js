const plan = require("./plan");
const validate = require("./validators");
const fs = require("fs");
const CONSTS = require("./consts");
const config = require("./config");

// Everything happens here.
async function main() {
  const query = loadJsonFromFile(config.SQL_JSON_FILE);
  await validate(query);
  const node = plan(query);
  await outputResult(node);
}

async function outputResult(node) {
  write("[");
  let row = await node.pull();
  if (row === CONSTS.END) {
    write("]\n");
    return;
  }
  write("\n");
  write(`    ${JSON.stringify(row.definitions)}`);
  while (row !== CONSTS.END) {
    writeRow(row);
    row = await node.pull();
  }
  write("\n]\n");
}

function write(string) {
  config.OUTPUT_STREAM.write(string);
}

function writeRow(row) {
  config.OUTPUT_STREAM.write(`,\n    ${JSON.stringify(row.values)}`);
}

function loadJsonFromFile(path) {
  const contents = fs.readFileSync(path, { encoding: "ascii" });
  return JSON.parse(contents);
}

if (require.main === module) {
  main()
    .catch((err) => {
      // single global error handler
      write(`ERROR: ${err.message}\n`);
    })
    .finally(() => {
      config.OUTPUT_STREAM.end();
    });
}
