const utils = require("./utils");

module.exports = (tableMap, query) => {
  if (!query.where.length) {
    return;
  }
  query.where.forEach((w) => {
    let leftType = w.left.literal
      ? getLiteralType(w.left.literal)
      : getColumnReferenceType(w.left.column, tableMap);
    let rightType = w.right.literal
      ? getLiteralType(w.right.literal)
      : getColumnReferenceType(w.right.column, tableMap);
    if (leftType !== rightType) {
      throw makeTypeError(leftType, rightType, w.op);
    }
  });
};

function makeTypeError(a, b, op) {
  return new Error(`Incompatible types to "${op}": ${a} and ${b}.`);
}

function getLiteralType(literal) {
  return typeof literal === "string" ? "str" : "int";
}

function getColumnReferenceType(cr, tableMap) {
  let table = cr.table;
  if (!table) {
    table = utils.findInAllTables(cr.name, tableMap)[0];
  }
  const [_, type] = tableMap[table].find(
    (columnDef) => columnDef[0] === cr.name
  );
  return type;
}
