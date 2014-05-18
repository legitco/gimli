var github = require('../lib/github');

exports.index = function(req, res, next) {
  github.issues(req.user, req.params.owner, req.params.repo, 1,
                function(err, issues) {
                  if(err) {
                    next(err);
                  } else {
                    res.json(issues);
                  }
                });
};

exports.notice = function(req, res, next) {
  console.log("Notice: " + JSON.stringify(req.body, null, 2));
  res.json(req.body);
};
