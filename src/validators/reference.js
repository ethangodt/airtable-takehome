const utils = require("./utils");

module.exports = (tableMap, query) => {
  // make sure reference in select are sound
  checkAllColumnRefs(
    query.select.map((s) => s.source),
    tableMap
  );
  // make sure reference in where are sound
  if (query.where.length) {
    checkAllColumnRefs(
      query.where.reduce((list, w) => {
        if (!w.left.literal) {
          list.push(w.left.column);
        }
        if (!w.right.literal) {
          list.push(w.right.column);
        }
        return list;
      }, []),
      tableMap
    );
  }
};

// ColumnRefs are used in both the 'select' and the 'where' clauses. This function
// takes a list of them and verifies that the references are sound.
function checkAllColumnRefs(columnRefs, tableMap) {
  columnRefs.forEach(({ table, name }) => {
    if (table === null) {
      const found = utils.findInAllTables(name, tableMap);
      if (found.length > 1) {
        console.log("hel");
        throw makeAmbiguityError(name, found);
      }
    } else {
      if (!tableMap[table]) {
        throw makeTableError(table);
      }
    }
  });
}

function makeTableError(tableName) {
  return new Error(`Unknown table name "${tableName}".`);
}

function makeAmbiguityError(name, found) {
  return new Error(
    `Column reference "${name}" is ambiguous; present in multiple tables: "${found.join(
      '", "'
    )}".`
  );
}
