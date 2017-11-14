[![Join the chat at https://gitter.im/cmd-line-args-parser/Lobby](https://badges.gitter.im/cmd-line-args-parser/Lobby.svg)](https://gitter.im/cmd-line-args-parser/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![CircleCI](https://circleci.com/gh/nrjais/cmd-line-args-parser/tree/master.svg?style=shield&circle-token=897e6a1defad17b1f69f974d5457ac530f4c0f7f)](https://circleci.com/gh/nrjais/cmd-line-args-parser/tree/master) [![Build Status](https://travis-ci.org/nrjais/cmd-line-args-parser.svg?branch=master)](https://travis-ci.org/nrjais/cmd-line-args-parser) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# cmd-line-args-parser

This is a command line arguments parser written in Javascript that helps parse command line arguments and it will return object with boolean-flags array ,value-option object and arguments list. You have to define rules to parse in a defined structure.

## Motivation

I am implementing head (shell command) functionality using node js I found that it's difficult write individual parser for each command So by installing this module you can build any command easily even if you are building your own command.

## Installation

`npm install cmd-line-args-parser`

## Usage

```javascript
var Parser=require('cmd-line-args-parser');

var parserName=new Parser(rules);

//the following is the structure for specifying rules

rules = {
  validOptions: [],    //all the valid options that require values
  default: {            //default option to set if no option specified
    'n': 10
  },
  minimum: 1,           /*
                          minimum number of required options if the arguments have
                          less than minimum options than default option will be set*/
  maximum: 1,           /*
                          maximum number of required options that are allowed
                          otherwise an error will be thrown*/
  flags: [],             //all the flags allowed
  replacer: {}           /*
                          rules that define replacers so that they can be converted
                          to a flag
                        */
}

 //pass an array of  things to parse method to get parsedArguments
 parserName.parse(args); //example let args =['-n','10','files'] for head
```

### Examples

#### Head command Parser

```javascript
  var Parser=require('cmd-line-args-parser');

  rules = {               //rules for head command
    validOptions: ['n','c'],
    default: {
      'n': 10
    },
    minimum: 1,
    maximum: 1,
    flags: ['h'],
    replacer: {'help':'h'} //here --help will be replaced by 'h' so 'h' should be valid flag
  }



  parserName.setCombinedFlags(true);
  /*
    false by default
    if false then two or more flags cannot be combined
    like '-acs'  will not work
    if true then it will be ['a','c','s']
  */

  //default if not given
  let containsValue = function(value) {
    let regex = /(\d)+$/g
    return regex.test(value);
  }

  /*
    containsValue is a function that can verify if a value is in the option or not
    like -n10 here 10 is the value so the function can determine if the
    option contains the value
    or not.
  */
  parserName.setContainsValue(containsValue);


  let isNumber = function(value){
    return Number.isInteger(+value);
  };
  /*
    isNumber is the function that determines if the value given value is legal or not
    if this function is not given then the below function is used by default.
  */
  parserName.setIsValue(isNumber);
  /*
    if no isValue function is set then the above isNumber will be used
    by default
  */

  let headParser = new Parser(rules);

  /*
    once some arguments are parsed then you need to reset the parser
    to parse new arguments again
    you can do that by
  */
  parserName.reset();

  //then you can reuse your parser
  parserName.parse(args);

```

## Errors thrown at different cases

```javascript
{
  name:'MaxOptions',
  message:'Cannot combine : -option1 -option2'
}
{
  name:'MissingValue',
  message:'Value of : -option is missing'}
{
  name:'IllegalOption',
  message:'Illegal option : -option'
}
{
  name:'CombiningFlags',                    //only when combinedFlags is set false
  message:'Combining Multiple flags not allowed'
}
```

## Different cases output for above parser rules

```javascript
  args=['-n10','-c12'];
  //output
  Error:Cannot combine options : -n -c

  args=['-n10',"toDo.txt"];
  //output
  {
    flags: [],
    options: {
      n: 10
    },
    arguments: ["toDo.txt"]
  }

  args=["--help"];
  //output
  {
    flags: ['h'],
    options: {
      n: 10
    },
    arguments: []
  }

  args=['-n12',"toDo.txt"];//once it see argument remaining everything is argument
  //output
  {
    flags: [],
    options: {
      n: 12
    },
    arguments: ["toDo.txt"]
  }

  args=[];
  //output
  {
    flags: [],
    options: {
      n: 10
    },
    arguments: []
  }


  args =['-10'];
  //output
  {
    flags: [],
    options: {
      n: 10
    },
    arguments: []
  }
```

### Unsupported Cases

```javascript
//when args as below
args=['-n10','-20'];
//it will replace n value with 20 because default option is n
{
  flags: [],
  options: {
    n: 20
  },
  arguments: ["toDo.txt"]
}
```
