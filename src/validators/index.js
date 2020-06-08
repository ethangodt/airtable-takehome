const reference = require("./reference");
const type = require("./type");
const Reader = require("../file-reader");
const utils = require("../utils");

module.exports = async (query) => {
  const columnDefinitions = await Promise.all(
    query.from.map((f) => {
      const get = async () => {
        const reader = new Reader(f.source);
        const rawDefs = await reader.readLine(2);
        return utils.stringifyRow(rawDefs);
      };
      return get();
    })
  );
  const tableMap = columnDefinitions.reduce((map, defs, i) => {
    map[query.from[i].name] = defs;
    return map;
  }, {});

  // Here we run through all of the validations.
  // We could easily add more validations to the list.
  // All a validator needs to do is 'throw' and the errors will be properly handled.
  [reference, type].forEach((check) => check(tableMap, query));
};
