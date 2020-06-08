const ambiguity = require('./ambiguity')
const reference = require('./ambiguity')
const type = require('./ambiguity')

module.exports = (query) => [ambiguity, reference, type].every(check => { check(query) })
