var _ = require('lodash');

var validateEnvVarExists = function(key) {
  if (!!process.env[key]) {
    throw new Error('envVarDefined(): ');
  }
}

var validateArray = function(varList) {
  if (varList == null || !(varList instanceof Array) || varList.length == 0) {
    throw new Error('validateInput(): First argument must be an array of strings');
  }
}

// Validate a single variable
var validateVar = function(envVar) {
  if (typeof envVar !== 'string') {
    throw new Error('validateVar(): ');
  }
}

exports.validate = function(varList) {
  validateArray(varList);
  _.map(varList, validateVar);
  _.map(varList, validateEnvVarExists);
}
