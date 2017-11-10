const assert = require('assert');
const Parser = require('../src/parser.js');
let test = {};

let getRules = function(validOptions = ['n', 'c'], flags = [], maximum = 1) {
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
};

test["isOption should return true if it contains '-' or '--'"] = function() {
  let parser = new Parser(getRules());
  assert.ok(parser.isOption('-h'));
  assert.ok(parser.isOption('-help'));
  assert.ok(parser.isOption('-10'));
  assert.ok(parser.isOption('--h'));
  assert.ok(parser.isOption('--help'));
};

test["isOption should return false if it doesn't contain '-' or '--'"] = function() {
  let parser = new Parser(getRules());
  assert.ok(!parser.isOption('h'));
  assert.ok(!parser.isOption('---help'));
  assert.ok(!parser.isOption('10'));
  assert.ok(!parser.isOption('---h'));
  assert.ok(!parser.isOption('help'));
};

test["isNumber should return false if it is a number"] = function() {
  let parser = new Parser(getRules());
  assert.ok(parser.isNumber('10'));
  assert.ok(parser.isNumber('5'));
  assert.ok(parser.isNumber('0'));
  assert.ok(parser.isNumber(10));
  assert.ok(parser.isNumber(1));
};

test["isNumber should return false if it is not a number"] = function() {
  let parser = new Parser(getRules());
  assert.ok(!parser.isNumber('a'));
  assert.ok(!parser.isNumber('+'));
  assert.ok(!parser.isNumber('asd'));
};

test["hasValue should return true if the option contains value at last"] = function() {
  let parser = new Parser(getRules());
  assert.ok(parser.hasValue('a45'));
  assert.ok(parser.hasValue('hsj5'));
  assert.ok(parser.hasValue('45'));
};

test["hasValue should return true if the option contains value at in middle or no value"] = function() {
  let parser = new Parser(getRules());
  assert.ok(!parser.hasValue('a'));
  assert.ok(!parser.hasValue('hsj'));
  assert.ok(!parser.hasValue('45sa'));
};

test["getDefaultOptionValue should return default option with value"] = function() {
  let parser = new Parser(getRules());
  assert.deepEqual(parser.getDefaultOptionValue(), ['n', 10]);
};

test["getCombinedSeparately should return all options separated in array"] = function() {
  let parser = new Parser(getRules());
  parser.setCombinedFlags(true)
  assert.deepEqual(parser.getCombinedSeparately('acd'), ['a', 'c', 'd']);
};

test["getOptionAndValue should return option and value separated"] = function() {
  let parser = new Parser(getRules());
  assert.deepEqual(parser.getOptionAndValue('n10'), ['n', 10]);
  assert.deepEqual(parser.getOptionAndValue('nb'), ['n', 'b']);
};

exports.test = test;
