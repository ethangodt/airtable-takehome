// The Scan iterator retrieves one row at a time. This is not so important
// for the example tables in this takehome, but in reality table files
// are very large. We would not want to read the whole thing at one time.

const lineReader = require("line-reader");
const util = require("util");
const CONSTS = require("./consts");

const open = util.promisify(lineReader.open);
const CLOSING_BRACKET = "]";
const fileCache = {};
// e.g.
// {
//   "/examples/a.table.json": {
//     complete: true,
//     lines: [
//       "[",
//       '[["name", "str"], ["age", "int"]],',
//       '["Alice", 20],',
//       '["Bob", 30],',
//       '["Eve", 40]',
//       "]",
//     ],
//   },
// };

class Reader {
  constructor(absoluteFilePath) {
    this.linesRead = 0;
    this.hasReadAllLines = false;
    this.absoluteFilePath = absoluteFilePath;
    // if there is no cache for file create one
    if (!fileCache[this.absoluteFilePath]) {
      fileCache[this.absoluteFilePath] = {
        complete: false,
        lines: [],
      };
    }
  }

  async _readLine() {
    let row;
    // if the row is cached already use it
    if (fileCache[this.absoluteFilePath].lines[this.linesRead]) {
      row = fileCache[this.absoluteFilePath].lines[this.linesRead];
    } else {
      row = await this.reader.nextLine();
      fileCache[this.absoluteFilePath].lines[this.linesRead] = row;
    }
    this.linesRead++;
    return row;
  }

  async readLine() {
    if (!fileCache[this.absoluteFilePath].complete && !this.reader) {
      const reader = await open(this.absoluteFilePath);
      const nextLine = util.promisify(reader.nextLine);
      const close = util.promisify(reader.close);
      this.reader = {
        original: reader,
        close: close,
        nextLine: () => {
          return nextLine();
        },
      };
    }

    if (this.linesRead === 0) {
      const openingBracket = await this._readLine();
    }

    if (this.hasReadAllLines) {
      return CONSTS.END;
    }

    let row = await this._readLine();
    if (row === CLOSING_BRACKET) {
      // there will be no more rows of usable data, regardless of the file having more lines
      await this.reader.close();
      this.hasReadAllLines = true;
      fileCache[this.absoluteFilePath].complete = true;
      return CONSTS.END;
    } else {
      row =
        row[row.length - 1] === "," ? row.substring(0, row.length - 1) : row;
      return JSON.parse(row);
    }
  }


}

module.exports = Reader;
