module.exports = {
  getCell: (description, definitions, row) => {
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
  },
};
