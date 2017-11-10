// DO NOT RENAME THIS FILE
// This file is simply used to run all the tests you have written so far
// run it like this:
// node ./_runAllTests.js

let testFiles = ['test/parseTest','test/someMoreTests','test/separateTest',
                'test/errorTest'];

let files = 0;
let total = 0;

testFiles.forEach((file)=>{
  console.log('Running ' + file + ' tests\n');
  files++;
  let tests = require('./'+file).test;
  let allTests = Object.keys(tests);
  allTests.forEach((test)=>{
    console.log('------> '+test+'\n');
    total++
    tests[test]();
  })
  console.log('===========>\n');
});

console.log('\n\n' + total + ' tests passed from '+files + ' files');
