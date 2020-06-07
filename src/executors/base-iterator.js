const CONSTS = require("../consts");

class BaseIterator {
  constructor(children) {
    this.children = children;
    this.status = CONSTS.ITERATOR_STATUS.PROCESSING;
  }

  // The iterator pattern is a common pattern in DB query execution. It allows the discrete functional
  // steps of the query execution to be handled by different nodes using a very generic API. Each node
  // can be updated and optimized without affecting the way any other part of the resolver works.
  //
  // The pull() method asks this iterators child to pass up the smallest processed chunk of the final table
  // that it can. In some cases this might be one row, in other cases it might be the full table.
  pull() {}

  finish() {
    this.status = CONSTS.ITERATOR_STATUS.FINISHED;
  }
}

module.exports = BaseIterator;
