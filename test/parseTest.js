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

let containsNumber = function(option) {
  let regex = /(\d)+$/g;
  return regex.test(option);
}

let isNumber = function(value){
  return Number.isInteger(+value);
};

test["parse should give formatted object when has no arguments"] = function() {
  let args = [];
  let parser = new Parser(getRules(), isNumber, containsNumber);
  let expectedArgv = {
    flags: [],
    options: {
      n: 10
    },
    argsLength: 'noArgs',
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has only default option value (-number)"] = function() {
  let args = ["-2"];
  let parser = new Parser(getRules(), isNumber, containsNumber);
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    argsLength: 'noArgs',
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has only options with value combined (-n2)"] = function() {
  let args = ["-n2"];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    argsLength: 'noArgs',
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has only option and value separately (-n 3))"] = function() {
  let args = ["-n", "3"];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expectedArgv = {
    flags: [],
    options: {
      n: 3
    },
    argsLength: 'noArgs',
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has only arguments with default options"] = function() {
  let args = ["file.txt"];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expectedArgv = {
    flags: [],
    options: {
      n: 10
    },
    argsLength: 'single',
    arguments: ["file.txt"]
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has option(-2) and argument"] = function() {
  let args = ["-2", "file.txt"];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    argsLength: 'single',
    arguments: ["file.txt"]
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has options(-2) and filename"] = function() {
  let args = ["-2", "file.txt"];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    argsLength: 'single',
    arguments: ["file.txt"]
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has number of lines(-n 2) and filename"] = function() {
  let args = ["-n", "2", "file.txt"];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    argsLength: 'single',
    arguments: ['file.txt']
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has options(-2) multiple filename"] = function() {
  let args = ["-2", "file.txt", "second.txt"];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expectedArgv = {
    flags: [],
    options: {
      n: 2
    },
    argsLength: 'multiple',
    arguments: ["file.txt", "second.txt"]
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

test["parse should give formatted object when has multiple options combined(-ac)"] = function() {
  let args = ["-ac"];
  let rules = getRules([], ['a', 'c'], 2);
  let parser = new Parser(rules, isNumber, containsNumber);
  let expectedArgv = {
    flags: ['a', 'c'],
    options: {
      n: 10
    },
    argsLength: 'noArgs',
    arguments: []
  }
  assert.deepEqual(parser.parse(args), expectedArgv);
}

exports.test = test;
