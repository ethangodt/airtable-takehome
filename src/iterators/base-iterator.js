// The iterator pattern is a common pattern in DB query execution. It allows the discrete functional
// steps of the query execution to be handled by different nodes using a very generic API. Each node
// can be updated and optimized without affecting the way any other part of the resolver works.
//

const CONSTS = require("../consts");

class BaseIterator {
  constructor(children = []) {
    if (children.length === 1) {
      this.child = children[0];
    }
    this.children = children;
    this.status = CONSTS.ITERATOR_STATUS.PROCESSING;
  }

  finish() {
    this.status = CONSTS.ITERATOR_STATUS.FINISHED;
  }
}

module.exports = BaseIterator;
