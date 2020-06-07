class Row {
  constructor(values, definitions) {
    this.values = values;
    this.definitions = definitions;
  }

  static cross(a, b) {
    const newDefinitions = [...a.definitions, ...b.definitions];
    const newValues = [...a.values, ...b.values];
    return new Row(newValues, newDefinitions);
  }

  getCell(description) {
    if (description.literal !== undefined) {
      return description.literal;
    }
    const {
      column: { name, table },
    } = description;
    const rowIdx = this.definitions.findIndex((col) => {
      let tableMatches = table === col[0];
      let columnNameMatches = name === col[1];
      if (!table) {
        tableMatches = true;
      }
      return tableMatches && columnNameMatches;
    });
    return this.values[rowIdx];
  }
}

module.exports = Row;
