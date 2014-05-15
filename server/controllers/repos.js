var github = require('octonode');

function forUser(user, page, callback) {
  var client = github.client(user.access);
  var ghme = client.me();
  ghme.repos(page, callback);
};

module.exports = function(req, res, next) {
  var page = req.params.page;

  if (typeof page === "undefined") {
    page = 1;
  }

  forUser(req.user, page, function(err, repos) {
    res.json(repos);
  });
};
