let error = require('./error');

let Parser = function(parseRules,isValue,containsValue) {
  this.rules = parseRules;
  this.parsedData = {};
  this.reset();
  this.containsValue = containsValue || this.hasValue;
  this.isValue = isValue || this.isNumber;
}

Parser.prototype.reset = function() {
  this.parsedData = {
    flags: [],
    options: {},
    arguments: [],
    argsLength: 'noArgs'
  }
}

Parser.prototype.hasValue = function(option) {
  let regex = /(\d)+$/g;
  return regex.test(option);
}

Parser.prototype.parse = function(argsList) {
  let arg = argsList[0];
  if (this.isOption(arg)) {
    option = arg.replace('-', '');
    args = argsList.slice(1);
    this.handleOption(option, args);
    this.parse(args);
  } else {
    this.parsedData.arguments.push(...argsList);
  };
  return this.hasMinimumOptions();
}

Parser.prototype.hasMinimumOptions = function() {
  let options = Object.keys(this.parsedData.options)
  if (options.length < this.rules.minimum) {
    this.setDefaults();
  }
  if (options.length > this.rules.maximum) {
    throw new error('Max Options', 'Cannot combine : -' + options.join(' -'));
  }
  this.setArgumentsLength();
  return this.parsedData;
}

Parser.prototype.setArgumentsLength = function() {
  let data = this.parsedData;
  data.arguments.length > 0 && this.updateArgumentsLength('single');
  data.arguments.length > 1 && this.updateArgumentsLength('multiple');
}

Parser.prototype.updateArgumentsLength = function(update) {
  this.parsedData.argsLength = update;
}

Parser.prototype.setDefaults = function() {
  let defaultOption = this.getDefaultOptionValue();
  this.parsedData.options[defaultOption[0]] = defaultOption[1];
}


Parser.prototype.setOptionValue = function(option, value) {
  this.verifyValidity(option);
  if (this.isValue(value)) {
    this.parsedData.options[option] = value;
  } else {
    throw new error('Missing value', 'Value of : -' + option + ' is missing');
  }
  return true;
}

Parser.prototype.handleOption = function(option, argsList) {
  if (this.containsValue(option)) {
    this.setOptionValue(...this.getOptionAndValue(option));
  } else if (this.isFlag(option)) {
    this.parsedData.flags.push(option);
  } else if (option.length > 1) {
    let allOptions = this.getOptionsSeparately(option);
    allOptions.forEach((option) => this.handleOption(option, argsList));
  } else {
    this.setOptionValue(option, argsList.shift());
  };
  return this.parsedData;
}

Parser.prototype.getOptionsSeparately = function(options) {
  return options.match(/([^\W\d]|([\d]+))/g);
}

Parser.prototype.getDefaultOptionValue = function() {
  let defaultOption = Object.keys(this.rules.default)[0];
  let value = this.rules.default[defaultOption];
  return [defaultOption, value];
}

Parser.prototype.getOptionAndValue = function(option) {
  let optionValue = [];
  if (this.isValue(option)) {
    let defaultOption = this.getDefaultOptionValue()[0];
    optionValue.push(defaultOption, option);
  } else {
    let value = option.replace(option[0], "");
    optionValue.push(option[0], value);
  }
  return optionValue;
}

Parser.prototype.isNumber = function(option) {
  return Number.isInteger(+option);
}

Parser.prototype.isOption = function(option) {
  let regex = /^-(\w)+/g;
  return regex.test(option);
}

Parser.prototype.isFlag = function(option) {
  return this.rules.flags.includes(option);
}

Parser.prototype.verifyValidity = function(option) {
  let allLegal = this.rules.validOptions.concat(this.rules.flags);
  let legal = allLegal.includes(option);
  if (!legal) {
    throw new error("IllegalOption", "Illegal option : " + option);
  }
  return legal;
}

module.exports = Parser;
