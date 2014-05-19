function loop(data, filter) {
  if(typeof data === "object") {
    if(data instanceof Array) {
      array(data, filter);
    } else {
      object(data, filter);
    }
  }
}

function object(data, filter) {
  for(var prop in data) {
    if(!filter[prop]) {
      delete data[prop];
    } else {
      loop(data[prop], filter[prop]);

      if(typeof filter[prop] === "string") {
        // Rename the key
        data[filter[prop]] = data[prop];
        delete data[prop];
      }

      if(typeof filter[prop]["_rename"] === "string") {
        // Rename the key
        data[filter[prop]["_rename"]] = data[prop];
        delete data[prop];
      }
    }
  }
}

function array(data, filter) {
  for (var i = 0, tot = data.length; i < tot; i++) {
    loop(data[i], filter);
  }
}

module.exports = function(data, filter) {
  var output = JSON.parse(JSON.stringify(data));
  loop(output, filter);
  return output;
};
