// For now, since the instructions asked that the final submission not include
// optimizations like indexes or cross-product reordering I will stick with a
// simple "nested loop" cross join, where every query creates a full
// cross product of each table.
//
// It would be preferred for most queries to do a hash join or merge join
// depending on the information in the "where" clause. This instance could easily
// be updated to support that use case without affecting the rest of the program.
//
// It we be fun if we could add something like that later on in the interview process!
//

const BaseIterator = require("./base-iterator");
const Row = require("../row");
const CONSTS = require("../consts");

class Join extends BaseIterator {
  constructor(children) {
    super(children);
    this.join = [];
    this.sent = 0;
  }

  async pull() {
    if (this.join.length === 0) {
      this.join = crossN(await this.fetchAllRows());
    }

    if (this.sent >= this.join.length) {
      return CONSTS.END;
    } else {
      const row = this.join[this.sent];
      this.sent++;
      return row;
    }
  }

  async fetchAllRows() {
    return Promise.all(
      this.children.map((node) => {
        const fetch = async () => {
          const rows = [];
          while (node.status !== CONSTS.ITERATOR_STATUS.FINISHED) {
            const row = await node.pull();
            if (row !== CONSTS.END) {
              rows.push(row);
            }
          }
          return rows;
        };
        return fetch();
      })
    );
  }
}

function crossTwo(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result.push(Row.cross(a[i], b[j]));
    }
  }
  return result;
}

function crossN(tables) {
  const lastTwoCrossed = crossTwo(
    tables[tables.length - 2],
    tables[tables.length - 1]
  );
  if (tables.length === 2) {
    return lastTwoCrossed;
  } else {
    return crossN([...tables.slice(0, tables.length - 2), lastTwoCrossed]);
  }
}

module.exports = Join;
