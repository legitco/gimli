var checkEnvVars = function(varList) {
  this.varList = varList;
};

checkEnvVars.prototype.isEnvVarDefined = function(key) {
  return !!process.env[key];
}

checkEnvVars.prototype.validateInput = function(varList) {
  var argumentError = function() {
    throw new Error('expectVars(): First argument must be an array of strings');
  }

  if (varList == null || !(varList instanceof Array) || varList.length == 0) {
    argumentError();
  } else {
    for (var i = 0, max = varList.length; i < max; i++) {
      if (typeof varList[i] !== 'string') {
        argumentError();
      }
    } // for
  } // if

  this.varList = varList;

  return true
}

module.exports = checkEnvVars;
