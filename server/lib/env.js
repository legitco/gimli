var _ = require('lodash');
var colors = require('colors');

var validateArray = function(varList) {
  if (varList == null || !(varList instanceof Array) || varList.length == 0) {
    throw new Error('Caller must provide an Array of environment variable name strings.');
  }
};

// Validate a single variable
var validateVar = function(envVar) {
  if (typeof envVar !== 'string') { //typeof envVar.toString() !== 'string'
    throw new Error('Expected a string containing an environment variable name, got ' + (typeof envVar));
  }
};

var validateEnvVarExists = function(key) {
  if (!process.env[key]) {
    throw new Error('"' + key + '" is not a valid environment variable');
  }
};

exports.validate = function(varList) {
  validateArray(varList);
  _.map(varList, validateVar);
  _.map(varList, validateEnvVarExists);
  return true;
};
