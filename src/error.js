const Error = function(name, message) {
  this.name = name;
  this.message = message;
}

Error.prototype.throw = function(){
  throw this;
}
module.exports = Error;
