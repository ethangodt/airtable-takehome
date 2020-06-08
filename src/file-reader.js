// The Scan iterator retrieves one row at a time. This is not so important
// for the example tables in this takehome, but in reality table files
// are very large. We would not want to read the whole thing at one time.

const lineReader = require("line-reader");
const util = require("util");
const CONSTS = require("./consts");
const config = require("./config");
const path = require("path");

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
  constructor(sourceTableName) {
    this.linesRead = 0;
    this.hasReadAllLines = false;
    this.absoluteFilePath = path.resolve(
      config.TABLE_FOLDER,
      `${sourceTableName}.table.json`
    );
    // if there is no cache for file create one
    if (!fileCache[this.absoluteFilePath]) {
      fileCache[this.absoluteFilePath] = {
        complete: false,
        lines: [],
      };
    }
  }

  async _initializeModule() {
    const self = this;
    const thirdPartyReader = await open(this.absoluteFilePath);
    const nextLine = util.promisify(thirdPartyReader.nextLine);
    const close = util.promisify(thirdPartyReader.close);
    return {
      original: thirdPartyReader,
      close: close,
      readerLineCount: 0,
      nextLine: async function () {
        let row;
        if (fileCache[self.absoluteFilePath].lines[this.readerLineCount]) {
          row = fileCache[self.absoluteFilePath].lines[this.readerLineCount];
        } else {
          row = await nextLine();
          fileCache[self.absoluteFilePath].lines[this.readerLineCount] = row;
        }
        this.readerLineCount++;
        return row;
      },
    };
  }

  async _nextRow() {
    this.linesRead++;
    return this.reader.nextLine();
  }

  async nextRow() {
    if (!fileCache[this.absoluteFilePath].complete && !this.reader) {
      this.reader = await this._initializeModule();
    }

    console.log(this.linesRead);
    if (this.linesRead === 0) {
      const openingBracket = await this._nextRow();
      const columnDefinitions = await this._nextRow();
      console.log('col', columnDefinitions);
    }

    if (this.hasReadAllLines) {
      return CONSTS.END;
    }

    let row = await this._nextRow();
    console.log('umm', row);
    if (row === CLOSING_BRACKET) {
      // there will be no more rows of usable data, regardless of the file having more lines
      await this.reader.close();
      this.hasReadAllLines = true;
      fileCache[this.absoluteFilePath].complete = true;
      return CONSTS.END;
    } else {
      return row;
    }
  }

  async readLine(num) {
    const reader = await this._initializeModule();
    let reps = num;
    let line;
    while (reps) {
      line = reader.nextLine();
      reps--;
    }
    await reader.close();
    return line;
  }
}

module.exports = Reader;
