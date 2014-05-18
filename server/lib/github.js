var github = require('octonode');

exports.subscribe = function(user, owner, repo, callback) {
  var client = github.client(user.access);
  var ghrepo = client.repo(owner + '/' + repo);
  ghrepo.hook({
    "name": "web",
    "active": true,
    "events": ["issues", "issue_comment"],
    "config": {
      "url": "https://gim-legit.herokuapp.com/notice/issue",
      "content_type": "json"
    }
  }, callback);
};

exports.repos = function(user, page, callback) {
  var client = github.client(user.access);
  var ghme = client.me();
  ghme.repos(page, callback);
};

exports.issues = function(user, owner, repo, page, callback) {
  var client = github.client(user.access);
  var ghrepo = client.repo(owner + '/' + repo);
  ghrepo.issues(page, callback);
};
