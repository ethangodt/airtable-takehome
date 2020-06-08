module.exports = {
  findInAllTables: (name, tableMap) => {
    const tables = [];
    for (let tableName in tableMap) {
      if (tableMap.hasOwnProperty(tableName)) {
        tableMap[tableName].forEach((columnDefinition) => {
          if (columnDefinition[0] === name) {
            tables.push(tableName);
          }
        });
      }
    }
    return tables;
  },
};
