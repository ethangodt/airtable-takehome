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
    this.predicates = predicates.map(makePredicate.bind(this));
  }

  async pull() {
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
}

function makePredicate({ op, left, right }) {
  return (row) => {
    return comparisons[op](row.getCell(left), row.getCell(right));
  };
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
