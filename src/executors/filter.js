const BaseIterator = require('./base-iterator')

class Filter extends BaseIterator {
  constructor (child) {
    super(child);
  }

}

module.exports = Filter
