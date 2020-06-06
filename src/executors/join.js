const BaseIterator = require('./base-iterator')

// For now, since the instructions asked that the final submission not include
// optimizations like indexes or cross-product reordering I will stick with a
// simple "nested loop" cross product join, where every query creates a full
// cross product of each table.
//
// Obviously it would be preferred for most queries to do a hash join or merge join
// depending on the information in the "where" clause. This instance could easily
// be updated to support that use case without affecting the rest of the program.
//
// It we be fun if we could add something like that later on in the interview process!
//
class Join extends BaseIterator {
  constructor (child) {
    super(child);
  }

}
