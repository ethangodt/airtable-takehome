const fs = require("fs");

const args = process.argv.slice(2);

if (args.length !== 3) {
  console.error("Usage: COMMAND <table-folder> <sql-json-file> <output-file>");
  throw process.exit(1);
}

const [tableFolder, sqlJsonFile, outputFile] = args;

module.exports = {
  TABLE_FOLDER: tableFolder,
  SQL_JSON_FILE: sqlJsonFile,
  OUTPUT_STREAM: fs.createWriteStream(outputFile),
};
