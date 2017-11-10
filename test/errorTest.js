const assert = require('assert');
const Error = require('../src/error.js');
let test = {};

test["throw should throw an error"] = function(){
  let error = new Error('error','hello');
  try{
    error.throw();
    assert.ok(false);
  }catch(err){
    assert.equal(err.message,'hello');
    assert.equal(err.name,'error');
  }
};


exports.test = test;
