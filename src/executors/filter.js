const BaseIterator = require("./base-iterator");
const CONSTS = require("../consts");

// {
//   "op": ">",
//     "left": {"column": {"name": "distance", "table": null}},
//   "right": {"column": {"name": "age", "table": "a2"}}
// },

class Filter extends BaseIterator {
  constructor(predicates, child) {
    super();
    this.child = child;
    this.predicates = predicates.map(this.makePredicate.bind(this));
  }

  async pull() {
    if (!this.columnDefinitions) {
      this.columnDefinitions = await this.getColumnDefinitions();
    }

    if (this.status === CONSTS.ITERATOR_STATUS.FINISHED) {
      return CONSTS.END;
    }

    let approvedRow;
    while (!approvedRow) {
      const row = await this.child.pull();
      if (row === CONSTS.END) {
        this.finish();
        approvedRow = row;
        break;
      }
      if (this.predicates.every((fn) => fn(row))) {
        approvedRow = row;
      }
    }

    return approvedRow;
  }

  getCell(description, row) {
    if (description.literal !== undefined) {
      return description.literal;
    }
    const {
      column: { name, table },
    } = description;
    const columnDefinitions = this.columnDefinitions;
    const rowIdx = columnDefinitions.findIndex((col) => {
      let tableMatches = table === col[0];
      let columnNameMatches = name === col[1];
      if (!table) {
        tableMatches = true;
      }
      return tableMatches && columnNameMatches;
    });
    return row[rowIdx];
  }

  makePredicate({ op, left, right }) {
    return (row) => {
      // console.log(this.getCell(left, row), op, this.getCell(right, row));
      return comparisons[op](this.getCell(left, row), this.getCell(right, row));
    };
  }

  async getColumnDefinitions() {
    if (this.columnDefinitions) {
      return this.columnDefinitions;
    }

    this.columnDefinitions = await this.child.getColumnDefinitions();
    return this.columnDefinitions;
  }
}

const comparisons = {
  "=": (a, b) => a === b,
  "!=": (a, b) => a !== b,
  ">": (a, b) => a > b,
  ">=": (a, b) => a >= b,
  "<": (a, b) => a < b,
  "<=": (a, b) => a <= b,
};

module.exports = Filter;
