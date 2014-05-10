var db = require('../lib/db');

var User = function(id, displayName, username) {
  this.id = id;
  this.displayName = displayName;
  this.username = username;
};

var Model = function() {};
Model.prototype.load = function(id, callback) {
  if (id !== null && typeof id !== "undefined") {
    db.multi().get('gimli:user:' + id + ':displayName')
      .get('gimli:user:' + id + ':username')
      .exec(function(err, replies) {
        callback(new User(id, replies[0], replies[1]));
      });
  } else {
    callback(null);
  }
};

Model.prototype.save = function(user) {
  db.multi()
    .set('gimli:user:' + user.id + ':displayName', user.displayName)
    .set('gimli:user:' + user.id + ':username', user.username)
    .exec();
};

module.exports = new Model();
