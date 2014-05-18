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
    _rename: 'author', login: true, id: true, avatar_url: true, html_url: 'url'
  },
  labels: {
    name: true, color: true
  },
  milestone: {
    number: true, state: true, title: true
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

var ISSUE_FILTER = {
  html_url: 'url',
  number: 'id',
  state: true,
  title: true,
  body: true,
  user: {
    _rename: 'author', login: true, id: true, avatar_url: true, html_url: 'url'
  },
  assignee: {
    login: true, id: true, avatar_url: true, html_url: 'url'
  },
  labels: {
    name: true, color: true
  },
  milestone: {
    number: true, state: true, title: true
  },
  pull_request: {
    html_url: 'url'
  },
  comments: true,
  closed_at: true,
  closed_by: {
    login: true, id: true, avatar_url: true, html_url: 'url'
  },
  created_at: true,
  updated_at: true
};

exports.issue = function(user, owner, repo, number, callback) {
  var client = github.client(user.access);
  var ghissue = client.issue(owner + '/' + repo, number);
  ghissue.info(function(err, data) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, filter(data, ISSUE_FILTER));
    }
  });
};

var COMMENT_FILTER = {
  id: true,
  html_url: 'url',
  body: true,
  user: {
    _rename: 'author', login: true, id: true, avatar_url: true, html_url: 'url'
  },
  created_at: true,
  updated_at: true
};

exports.comments = function(user, owner, repo, number, callback) {
  var client = github.client(user.access);
  var ghissue = client.issue(owner + '/' + repo, number);
  ghissue.comments(function(err, data) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, filter(data, COMMENT_FILTER));
    }
  });
};
