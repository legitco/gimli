var github = require('../lib/github');

function page(req) {
  var p = req.query.page;

  if (typeof p === "undefined") {
    return 1;
  } else {
    return p;
  }
}

function respond(err, data, res, next) {
  if (err) {
    next(err);
  } else {
    res.json(data);
  }
}

exports.index = function(req, res, next) {
  github.repos(req.user, page(req), function(err, repos) {
    respond(err, repos, res, next);
  });
};

exports.subscribe = function(req, res, next) {
  var owner = req.params.owner;
  var repo = req.params.repo;

  github.subscribe(req.user, owner, repo, function(err, reply) {
    respond(err, reply, res, next);
  });
};
