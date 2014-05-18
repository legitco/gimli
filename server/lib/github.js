var github = require('octonode');
var filter = require('../lib/filter');

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

var ISSUES_FILTER = {
  html_url: 'url',
  number: 'id',
  state: true,
  title: true,
  user: {
    _rename: 'author',
    login: true,
    id: true,
    avatar_url: true,
    html_url: 'url'
  },
  labels: {
    name: true,
    color: true
  },
  milestone: {
    number: true,
    state: true,
    title: true
  },
  comments: true,
  closed_at: true,
  created_at: true,
  updated_at: true
};

exports.issues = function(user, owner, repo, page, callback) {
  var client = github.client(user.access);
  var ghrepo = client.repo(owner + '/' + repo);
  ghrepo.issues(page, function(err, data) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, filter(data, ISSUES_FILTER));
    }
  });
};
