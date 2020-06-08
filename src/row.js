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

  getCellValue({ name, table }) {
    const colIdx = this.getColumnIndex({ name, table });
    return this.values[colIdx];
  }

  getColumnIndex({ name, table }) {
    return this.definitions.findIndex((col) => {
      let tableMatches = table === col[0];
      let columnNameMatches = name === col[1];
      if (!table) {
        tableMatches = true;
      }
      return tableMatches && columnNameMatches;
    });
  }
}

module.exports = Row;
