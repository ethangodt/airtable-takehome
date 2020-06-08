// The file-reader retrieves one row at a time and is used in iterators and validators.
//
// This is not so important for the example tables in this takehome, but in reality table files
// are very large. We would not want to read the whole thing at one time.
//
// P.S. I had a bunch of code in here to cache line reads from the file, but it was
// getting pretty complicated for a take home [I worry this is already complicated enough :)]
//
// e.g.
// const fileCache = {
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
//

const lineReader = require("line-reader");
const util = require("util");
const CONSTS = require("./consts");
const config = require("./config");
const path = require("path");

const open = util.promisify(lineReader.open);
const CLOSING_BRACKET = "]";

class Reader {
  constructor(sourceTableName) {
    this.linesRead = 0;
    this.absoluteFilePath = path.resolve(
      config.TABLE_FOLDER,
      `${sourceTableName}.table.json`
    );
  }

  async _initializeModule() {
    const self = this;
    const thirdPartyReader = await open(this.absoluteFilePath);
    const nextLine = util.promisify(thirdPartyReader.nextLine);
    const close = util.promisify(thirdPartyReader.close);
    return {
      original: thirdPartyReader,
      close: close,
      nextLine: nextLine,
    };
  }

  async _nextRow() {
    this.linesRead++;
    return this.reader.nextLine();
  }

  async nextRow() {
    if (this.status === CONSTS.ITERATOR_STATUS.FINISHED) {
      return CONSTS.END;
    }

    if (!this.reader) {
      this.reader = await this._initializeModule();
    }

    if (this.linesRead === 0) {
      const openingBracket = await this._nextRow();
      const columnDefinitions = await this._nextRow();
    }

    let row = await this._nextRow();
    if (row === CLOSING_BRACKET) {
      // there will be no more rows of usable data, regardless of the file having more lines
      await this.reader.close();
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
