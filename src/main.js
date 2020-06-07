const Scan = require("./executors/scan");
const Join = require("./executors/join");

async function start() {
  const node = new Join([
    new Scan("examples/a.table.json"),
    new Scan("examples/a.table.json"),
    new Scan("examples/b.table.json"),
  ]);
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
  console.log(await node.pull());
}

start();

// lineReader.open(path.resolve('./examples/a.table.json'), (reader) => {
//
// })

// const fs = require('fs');
// const readline = require('readline');
// const path = require('path');
//
// async function processLineByLine() {
//   const fileStream = fs.createReadStream(path.resolve('./examples/a.table.json'));
//
//   const rl = readline.createInterface({
//     input: fileStream,
//     crlfDelay: Infinity
//   });
//   // Note: we use the crlfDelay option to recognize all instances of CR LF
//   // ('\r\n') in input.txt as a single line break.
//
//   await rl.pull()
//
//
//   for await (const line of rl) {
//     // Each line in input.txt will be successively available here as `line`.
//     console.log(`Line from file: ${line}`);
//   }
// }
//
// processLineByLine();

// const Table = require('./table');
//
// const fs = require('fs');
// const path = require('path');
//
// function main() {
//     const args = process.argv.slice(2);
//     if (args.length !== 3) {
//         console.error("Usage: COMMAND <table-folder> <sql-json-file> <output-file>");
//         throw process.exit(1);
//     }
//
//     const [tableFolder, sqlJsonFile, outputFile] = args;
//
//     // Load the query JSON.
//     const query = loadJsonFromFile(sqlJsonFile);
//
//     // Load all the tables referenced in the "FROM" clause.
//     const tables = [];
//     for (const tableDecl of query.from) {
//         const tableSourcePath = path.join(tableFolder, `${tableDecl.source}.table.json`);
//         const rawTable = loadJsonFromFile(tableSourcePath);
//         const table = new Table(rawTable[0], rawTable.slice(1));
//         tables.push(table);
//     }
//
//     // TODO: Actually evaluate query.
//     // For now, just dump the input back out.
//     const outFd = fs.openSync(outputFile, 'w');
//     try {
//         fs.writeSync(outFd, JSON.stringify(query, null, 4));
//         fs.writeSync(outFd, '\n');
//
//         for (const table of tables) {
//             writeTable(outFd, table);
//         }
//     } finally {
//         fs.closeSync(outFd);
//     }
// }
//
// function writeTable(outFd, table) {
//     fs.writeSync(outFd, "[\n");
//     fs.writeSync(outFd, `    ${JSON.stringify(table.columns)}`);
//     for (const row of table.rows) {
//         fs.writeSync(outFd, `,\n    ${JSON.stringify(row)}`);
//     }
//     fs.writeSync(outFd, "\n]\n");
// }
//
// function loadJsonFromFile(path) {
//     const contents = fs.readFileSync(path, {encoding: 'ascii'});
//     return JSON.parse(contents);
// }
//
// if (require.main === module) {
//     main();
// }
