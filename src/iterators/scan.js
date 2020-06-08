// The Scan iterator does a "file scan" on the DB "heap file"
// using some underlying file reader class. In this case the
// underlying reader caches the file and can be reused.
//
// Similarly, if a single query uses the same table twice, then
// our underlying reader will avoid reading duplicate lines from the
// file on disk if possible.
//
const path = require("path");
const BaseIterator = require("./base-iterator");
const Reader = require("../file-reader");
const CONSTS = require("../consts");
const Row = require("../row");
const config = require("../config");
const utils = require("../utils");

class Scan extends BaseIterator {
  constructor(tableName, sourceName) {
    super();
    this.reader = new Reader(sourceName);
    this.tableName = tableName;
  }

  async pull() {
    if (this.status === CONSTS.ITERATOR_STATUS.FINISHED) {
      return CONSTS.END;
    }
    let rawRow = await this.reader.nextLine();
    if (rawRow === CONSTS.END) {
      this.finish();
      return CONSTS.END;
    } else {
      return new Row(
        utils.stringifyRow(rawRow),
        await this.getColumnDefinitions()
      );
    }
  }

  async getColumnDefinitions() {
    if (this.columnDefinitions) {
      return this.columnDefinitions;
    }
    const rawDefinitions = await this.reader.readLine(2);
    this.columnDefinitions = utils.stringifyRow(rawDefinitions).map((def) => {
      return [this.tableName].concat(def);
    });
    return this.columnDefinitions;
  }
}

module.exports = Scan;
