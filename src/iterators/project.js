const BaseIterator = require("./base-iterator");
const Row = require("../row");
const CONSTS = require("../consts");

// [
//   {"name": "a1_name", "source": {"name": "name", "table": "a1"}},
//   {"name": "age", "source": {"name": "age", "table": "a1"}},
//   {"name": "a2_name", "source": {"name": "name", "table": "a2"}},
//   {"name": "distance", "source": {"name": "distance", "table": "b"}}
// ]

class Project extends BaseIterator {
  constructor(descriptions, child) {
    super([child]);
    this.descriptions = descriptions;
  }

  async pull() {
    if (this.status === CONSTS.ITERATOR_STATUS.FINISHED) {
      return CONSTS.END;
    }
    const row = await this.child.pull();
    if (row === CONSTS.END) {
      this.finish();
      return CONSTS.END;
    }
    const newOrder = this.generateNewOrder(row);
    const newValues = this.projectValues(row, newOrder);
    const newDefinitions = this.projectDefinitions(row, newOrder);
    return new Row(newValues, newDefinitions);
  }

  projectValues(row, newOrder) {
    return newOrder.map((colIdx) => {
      return row.values[colIdx];
    });
  }

  projectDefinitions(row, newOrder) {
    if (this.newDefinitions) {
      return this.newDefinitions;
    }
    this.newDefinitions = newOrder.map((colIdx, i) => {
      return [this.descriptions[i].name, row.definitions[colIdx][2]];
    });
    return this.newDefinitions;
  }

  generateNewOrder(row) {
    if (this.newOrder) {
      return this.newOrder;
    }
    this.newOrder = this.descriptions.map((description) => {
      return row.getColumnIndex(description.source);
    });
    return this.newOrder;
  }
}

module.exports = Project;
