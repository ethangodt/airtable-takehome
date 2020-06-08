// In a "real" system the RDBMS would have a "query planner" that looks at an
// incoming valid query to be executed and generates an efficient plan of iterator
// nodes. e.g. The information available using the EXPLAIN keyword in postgres.
//
// In this case I'm hardly doing any planning, but it could be added later.

const Scan = require("./iterators/scan");
const Join = require("./iterators/join");
const Filter = require("./iterators/filter");
const Project = require("./iterators/project");

module.exports = function planner(query) {
  // we'll always have froms to scan
  const scans = query.from.map((f) => new Scan(f.name, f.source));
  let node;
  // we may need to join multiple scans to make a cartesian product
  if (scans.length > 1) {
    node = new Join(scans);
  } else {
    node = scans[0];
  }
  // we may need to filter the table up to this point
  if (query.where) {
    node = new Filter(query.where, node);
  }
  // we will always have some projection to do
  node = new Project(query.select, node);
  // the output of this node would be ready to stream to an output file
  // to get each row repeatedly call .pull() until the end sentinel value.
  return node;
};
