module.exports = {
  stringifyRow: (row) => {
    row = row[row.length - 1] === "," ? row.substring(0, row.length - 1) : row;
    return JSON.parse(row);
  },
};
