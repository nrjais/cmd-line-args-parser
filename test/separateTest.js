const assert = require('assert');
const lib = require('../src/parser.js');
let test = {};

let getRules = function(validOptions = ['n', 'c'], flags = [],maximum = 1) {
  return {
    validOptions: validOptions,
    default: {
      'n': 10
    },
    minimum: 1,
    maximum: maximum,
    flags: flags,
    verbose: {}
  };
}

// parse
// isOption
// isNumber
// handleOption
// containsValue
// verifyValidity
// getOptionAndValue
// getOptionsSeparately
// getDefaultOptionValue

exports.test = test;
