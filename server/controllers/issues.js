var github = require('../lib/github');

function respond(res, next, err, data) {
  if(err) {
    next(err);
  } else {
    res.json(data);
  }
};

exports.index = function(req, res, next) {
  github.issues(req.user, req.params.owner, req.params.repo, 1,
                function(err, issues) {
                  respond(res, next, err, issues);
                });
};

exports.show = function(req, res, next) {
  github.issue(req.user, req.params.owner, req.params.repo, req.params.number,
               function(err, issue) {
                 respond(res, next, err, issue);
               });
};

exports.comments = function(req, res, next) {
  github.comments(req.user, req.params.owner, req.params.repo, req.params.number,
               function(err, comments) {
                 respond(res, next, err, comments);
               });
};

exports.notice = function(req, res, next) {
  console.log("Notice: " + JSON.stringify(req.body, null, 2));
  res.json(req.body);
};
