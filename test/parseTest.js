const assert = require('assert');
let Parser = require('../src/parser.js');
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
}

test["parse should give formatted object when has no arguments"] = function() {
  let args = [];
  let parser = new Parser(getRules());;
  let expectedArgv = {
    flags: [],
    options: {
      n: 10
    },
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has only default option value (-number)"] = function() {
  let args = ["-2"];
  let parser = new Parser(getRules());;
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has only options with value combined (-n2)"] = function() {
  let args = ["-n2"];
  let parser = new Parser(getRules());
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has only option and value separately (-n 3))"] = function() {
  let args = ["-n", "3"];
  let parser = new Parser(getRules());
  let expectedArgv = {
    flags: [],
    options: {
      n: 3
    },
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has only arguments with default options"] = function() {
  let args = ["file.txt"];
  let parser = new Parser(getRules());
  let expectedArgv = {
    flags: [],
    options: {
      n: 10
    },
    arguments: ["file.txt"]
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has option(-2) and argument"] = function() {
  let args = ["-2", "file.txt"];
  let parser = new Parser(getRules());
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    arguments: ["file.txt"]
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has options(-2) and filename"] = function() {
  let args = ["-2", "file.txt"];
  let parser = new Parser(getRules());
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    arguments: ["file.txt"]
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has number of lines(-n 2) and filename"] = function() {
  let args = ["-n", "2", "file.txt"];
  let parser = new Parser(getRules());
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    arguments: ['file.txt']
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has options(-2) multiple filename"] = function() {
  let args = ["-2", "file.txt", "second.txt"];
  let parser = new Parser(getRules());
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    arguments: ["file.txt", "second.txt"]
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has multiple options combined(-ac)"] = function() {
  let args = ["-ac"];
  let rules = getRules([], ['a', 'c'], 2);
  let parser = new Parser(rules);;
  parser.setCombinedFlags(true)
  let expectedArgv = {
    flags: ['a', 'c'],
    options: {
      n: 10
    },
    arguments: []
  };
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should throw error when value is missing"] = function() {
  let args = ["-n"];
  let parser = new Parser(getRules());
  try {
    parser.parse(args)
    assert.ok(false);
  } catch (err) {
    assert.equal(err.name,'MissingValue');
  }
}

test["parse should throw error when value is invalid"] = function() {
  let args = ["-n",'a'];
  let parser = new Parser(getRules());
  try {
    parser.parse(args)
    assert.ok(false);
  } catch (err) {
    assert.equal(err.name,'MissingValue');
  }
}

exports.test = test;
