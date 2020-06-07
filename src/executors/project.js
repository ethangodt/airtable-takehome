const BaseIterator = require("./base-iterator");

// [
//   {"name": "a1_name", "source": {"name": "name", "table": "a1"}},
//   {"name": "age", "source": {"name": "age", "table": "a1"}},
//   {"name": "a2_name", "source": {"name": "name", "table": "a2"}},
//   {"name": "distance", "source": {"name": "distance", "table": "b"}}
// ]

class Project extends BaseIterator {
  constructor(child) {
    super(child);
  }

  async pull() {

  }
}

module.exports = Project;
