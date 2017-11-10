const assert = require('assert');
let Parser = require('./../src/parser.js');
let test = {};

let getRules = function(flags = ['h']) {
  return {
    validOptions: ['n', 'c','d'],
    default: {
      'n': 10
    },
    minimum: 1,
    maximum: 2,
    combinedFlags : false,
    flags: flags,
    verbose: {
      'help': 'h'
    }
  };
}

let containsNumber = function(option) {
  let regex = /(\d)+$/g;
  return regex.test(option);
}


let isNumber = function(value) {
  return Number.isInteger(+value);
};

test['parse seperates options option and value'] = function() {
  let demoArgs1 = ['-n10', '-c12'];
  let parser = new Parser(getRules())
  let expected = {
    argsLength: 'noArgs',
    arguments: [],
    flags: [],
    options: {
      n: 10,
      c: 12
    },
  };
  let actual = parser.parse(demoArgs1);
  assert.deepEqual(actual, expected);
};
test['parse seperates options option and value and optional argument in arguments'] = function() {
  let demoArgs2 = ['-n10', '-c12', "toDo.txt"];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expected = {
    argsLength: 'single',
    arguments: ['toDo.txt'],
    flags: [],
    options: {
      n: 10,
      c: 12
    },
  };
  let actual = parser.parse(demoArgs2)
  assert.deepEqual(actual, expected);
};
test['parse seperates options and value,files in arguments and flags'] = function() {
  let demoArgs3 = ['-n12', "toDo.txt", '--help'];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expected = {
    argsLength: 'multiple',
    arguments: ['toDo.txt', '--help'],
    flags: [],
    options: {
      n: 12
    },
  };
  let actual = parser.parse(demoArgs3)
  assert.deepEqual(actual, expected);
};
test['parse gives default value of empty arguments'] = function() {
  let demoArgs4 = [];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expected = {
    argsLength: 'noArgs',
    arguments: [],
    flags: [],
    options: {
      n: 10
    },
  };
  let actual = parser.parse(demoArgs4);
  assert.deepEqual(actual, expected);
};
test['parse should put all the optional argument in arguments'] = function() {
  let demoArgs5 = ["toDo.txt", 'abc.txt'];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expected = {
    argsLength: 'multiple',
    arguments: ['toDo.txt', 'abc.txt'],
    flags: [],
    options: {
      n: 10
    },
  };
  let actual = parser.parse(demoArgs5);
  assert.deepEqual(actual, expected);
};
test['parse should seperates all the input in options,arguments and verbose'] = function() {
  let demoArgs6 = ['-n12', '-c12', '--help', 'toDo.txt', 'sample.js'];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  let expected = {
    argsLength: 'multiple',
    arguments: ['toDo.txt', 'sample.js'],
    flags: ['h'],
    options: {
      n: '12',
      c: '12'
    },
  };
  let actual = parser.parse(demoArgs6);
  assert.deepEqual(actual, expected);
};

test["parse should throw an error when trying to combine flags"] = function(){
  let args = ["-ac"];
  let parser = new Parser(getRules(['a','c']), isNumber, containsNumber)
  try {
    parser.parse(args);
    assert.ok(false);
  } catch (err) {
    assert.equal(err.name,'CombiningFlags')
  }
};

test["parse should throw an error when options exceed max allowed"] = function(){
  let args = ["-n4",'-c3','-d5'];
  let parser = new Parser(getRules(['a','c']), isNumber, containsNumber)
  try {
    parser.parse(args);
    assert.ok(false);
  } catch (err) {
    assert.equal(err.name,'MaxOptions');
  }
};


test["parse should throw an error when has invalid options option"] = function(){
  let args = ['-k5'];
  let parser = new Parser(getRules(), isNumber, containsNumber)
  try {
    parser.parse(args);
    assert.ok(false);
  } catch (err) {
    assert.equal(err.name,'IllegalOption');
  }
};

exports.test = test;
