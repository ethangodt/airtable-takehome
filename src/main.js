const planner = require("./planner");

const query = {
  select: [
    { name: "a1_name", source: { name: "name", table: "a1" } },
    { name: "age", source: { name: "age", table: "a1" } },
    { name: "a2_name", source: { name: "name", table: "a2" } },
    { name: "distance", source: { name: "distance", table: "b" } },
  ],
  from: [
    { name: "a1", source: "a" },
    { name: "a2", source: "a" },
    { name: "b", source: "b" },
  ],
  where: [
    {
      op: ">",
      left: { column: { name: "distance", table: null } },
      right: { column: { name: "age", table: "a2" } },
    },
    {
      op: "!=",
      left: { column: { name: "name", table: "a1" } },
      right: { literal: "Bob" },
    },
  ],
};

async function start() {
  const node = planner(query);
  console.log("final", await node.pull());
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

const Table = require('./table');

const fs = require('fs');
const path = require('path');

function main() {
    const args = process.argv.slice(2);
    if (args.length !== 3) {
        console.error("Usage: COMMAND <table-folder> <sql-json-file> <output-file>");
        throw process.exit(1);
    }

    const [tableFolder, sqlJsonFile, outputFile] = args;

    // Load the query JSON.
    const query = loadJsonFromFile(sqlJsonFile);

    // Load all the tables referenced in the "FROM" clause.
    const tables = [];
    for (const tableDecl of query.from) {
        const tableSourcePath = path.join(tableFolder, `${tableDecl.source}.table.json`);
        const rawTable = loadJsonFromFile(tableSourcePath);
        const table = new Table(rawTable[0], rawTable.slice(1));
        tables.push(table);
    }

    // TODO: Actually evaluate query.
    // For now, just dump the input back out.
    const outFd = fs.openSync(outputFile, 'w');
    try {
        fs.writeSync(outFd, JSON.stringify(query, null, 4));
        fs.writeSync(outFd, '\n');

        for (const table of tables) {
            writeTable(outFd, table);
        }
    } finally {
        fs.closeSync(outFd);
    }
}

function writeTable(outFd, table) {
    fs.writeSync(outFd, "[\n");
    fs.writeSync(outFd, `    ${JSON.stringify(table.columns)}`);
    for (const row of table.rows) {
        fs.writeSync(outFd, `,\n    ${JSON.stringify(row)}`);
    }
    fs.writeSync(outFd, "\n]\n");
}

function loadJsonFromFile(path) {
    const contents = fs.readFileSync(path, {encoding: 'ascii'});
    return JSON.parse(contents);
}

if (require.main === module) {
    main();
}
