const BaseIterator = require("./base-iterator");
const CONSTS = require("../consts");

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
class Join extends BaseIterator {
  constructor(children) {
    super(children);
    this.children = children;
    this.join = [];
    this.sent = 0;
  }

  async pull() {
    if (this.join.length === 0) {
      // const allRows = await this.fetchAllRows()
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

  async getColumnDefinitions() {
    if (this.columnDefinitions) {
      return this.columnDefinitions;
    }
    const disparateDefinitions = await Promise.all(
      this.children.map((node) => node.getColumnDefinitions())
    );

    this.columnDefinitions = disparateDefinitions.reduce((list, def) => {
      return list.concat(def);
    }, []);

    return this.columnDefinitions
  }
}

function crossTwo(a, b) {
  const result = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result.push(a[i].concat(b[j]));
    }
  }
  return result;
}

function crossN(lists) {
  const lastTwo = crossTwo(lists[lists.length - 2], lists[lists.length - 1]);
  if (lists.length === 2) {
    return lastTwo;
  } else {
    return crossN([...lists.slice(0, lists.length - 2), lastTwo]);
  }
}

module.exports = Join;
