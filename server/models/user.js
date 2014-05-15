var db = require('../lib/db');

var key = function(id, name) {
  return('gimli:user:' + id + ':' + name);
};

var Model = function() {};
Model.prototype.load = function(id, callback) {
  if (id !== null && typeof id !== "undefined") {
    db.multi()
      .get(key(id, "name"))
      .get(key(id, "login"))
      .get(key(id, "html_url"))
      .get(key(id, "avatar_url"))
      .get(key(id, "email"))
      .get(key(id, "location"))
      .get(key(id, "access"))
      .exec(function(err, replies) {
        callback({
          id: id,
          name: replies[0],
          login: replies[1],
          html_url: replies[2],
          avatar_url: replies[3],
          email: replies[4],
          location: replies[5],
          access: replies[6]
        });
      });
  } else {
    callback(null);
  }
};

Model.prototype.save = function(user, access, done) {
  var id = user._json.id;
  db.multi()
    .set(key(id, 'name'), user._json.name)
    .set(key(id, 'login'), user._json.login)
    .set(key(id, 'html_url'), user._json.html_url)
    .set(key(id, 'avatar_url'), user._json.avatar_url)
    .set(key(id, 'email'), user._json.email)
    .set(key(id, 'location'), user._json.location)
    .set(key(id, 'access'), access)
    .exec(function(err, replies) {
      done();
    });
};

module.exports = new Model();
