var self = this;
var _ = require('lodash');
var colors = require('colors');

var logError = function(message) {
  console.error(message.underline.red);
  self.error = true;
}

var validateArray = function(varList) {
  if (varList == null || !(varList instanceof Array) || varList.length == 0) {
    logError('validateArray(): Caller must provide an Array of environment variable name strings.');
  }
}

// Validate a single variable
var validateVar = function(envVar) {
  if (typeof envVar !== 'string') { //typeof envVar.toString() !== 'string'
    logError('validateVar(): Expected a string containing an environment variable name, got ' + (typeof envVar));
  }
}

var validateEnvVarExists = function(key) {
  if (!process.env[key]) {
    logError('validateEnvVarExists(): "' + key + '" is not a valid environment variable');
  }
}

exports.validate = function(varList) {
  validateArray(varList);
  _.map(varList, validateVar);
  _.map(varList, validateEnvVarExists);

  console.log(self.error);
  if (self.error) {
    var error = new Error('Errors were detected with the supplied environment variables.');
    throw error;
  }
  return true;
}
