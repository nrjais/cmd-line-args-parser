
# cmd-line-args-parser

This is a command line arguments parser written in Javascript that helps parse command line arguments and it will return object with boolean flags ,value flags, arguments, optionSetBy and default option. You should define rules to parse.

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
  minimum: 1,           /*minimum number of required options if the arguments have
                          less than minimum options than default option will be set*/
  maximum: 1,           /*maximum number of required options that are allowed
                          otherwise an error will be thrown*/
  flags: [],             //all the flags allowed
  verbose: {}            // not implemented yet
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
    flags: [],
    verbose: {}
  }

  /*
  value verifier is a function that can verify if a value is in the option or not
  like -n10 here 10 is the value so the function can determine if the
  option contains the value
  or not.
  */

  let valueVerifier = function(value) {
    let regex = /(\d)+$/g
    return regex.test(value);
  }

  let headParser = new Parser(rules,valueVerifier);
/*
once some arguments are parsed then you need to reset the parser
to parse new arguments again
you can do that by
*/

parserName.reset();
```

## Errors thrown at different cases

```javascript
{
  name:'Max Options',
  message:'Cannot combine : -option1 -option2'
}
{
  name:'Missing value',
  message:'Value of : -option is missing'}
{
  name:'IllegalOption',
  message:'Illegal option : -option'
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
    argsLength : 'single',
    arguments: ["toDo.txt"]
  }

  args=['-n12',"toDo.txt"];//once it see argument remaining everything is argument
  //output
  {
    flags: [],
    options: {
      n: 12
    },
    argsLength : 'single',
    arguments: ["toDo.txt"]
  }

  args=[];
  //output
  {
    flags: [],
    options: {
      n: 10
    },
    argsLength : 'noArgs',
    arguments: []
  }


  args =['-10'];
  //output
  {
    flags: [],
    options: {
      n: 10
    },
    argsLength : 'noArgs',
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
  argsLength : 'single',
  arguments: ["toDo.txt"]
}
```
