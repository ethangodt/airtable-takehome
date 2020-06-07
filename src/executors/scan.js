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

class Scan extends BaseIterator {
  constructor(fileName) {
    super();
    this.reader = new Reader(path.resolve(fileName));
    this.columnDefinitions = null;
  }

  async pull() {
    if (this.status === CONSTS.ITERATOR_STATUS.FINISHED) {
      return CONSTS.END;
    }

    if (!this.columnDefinitions) {
      this.columnDefinitions = await this.reader.readLine();
    }

    const row = await this.reader.readLine();
    if (row === CONSTS.END) {
      this.finish();
      return CONSTS.END;
    } else {
      return row;
    }
  }
}

module.exports = Scan;
