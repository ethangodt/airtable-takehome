const STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  PROCESSING: 'PROCESSING',
  // ^^ There is still more data to be streamed, because this iterator node has
  // not yet received an 'eof' value signalling it's child will not provide
  // any more data.
}

class BaseIterator {
  constructor (child) {
    this.child = child
    this.status = STATUS.NOT_STARTED
  }

  // The iterator pattern is a common pattern in DB query execution. It allows the discrete functional
  // steps of the query execution to be handled by different nodes using a very generic API. Each node
  // can be updated and optimized without effecting the way any other part of the resolver works.
  //
  // The pull() method asks this iterators child to pass up the smallest processed chunk of the final table
  // that it can. In some cases this might be one row, in other cases it might be the full table.
  pull () {
    return this.child.pull()
  }
}


module.exports = BaseIterator
