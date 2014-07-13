var http = require('https');
var github = require('octonode');
var filter = require('../lib/filter');

function getRepo(req) {
  return req.session.client.repo(req.params.owner + '/' + req.params.repo);
}

function getIssue(req) {
  return req.session.client.issue(req.params.owner + '/' + req.params.repo,
                                  req.params.number);
}

// Middleware to load the client
exports.client = function(req, res, next) {
  req.session.client = github.client(req.user.access);
  next();
};

exports.subscribe = function(req, res, next) {
  var ghrepo = getRepo(req);
  ghrepo.hook({
    "name": "web",
    "active": true,
    "events": ["issues", "issue_comment"],
    "config": {
      "url": "https://gim-legit.herokuapp.com/notice/issue",
      "content_type": "json"
    }
  }, function(err, data) {
    if(err) {
      next(err);
    } else {
      res.jsonp(data);
    }
  });
};

exports.repos = function(req, res, next) {
  var ghme = req.session.client.me();
  ghme.repos(req.params.page, function(err, data) {
    if (err) {
      next(err);
    } else {
      res.jsonp(data);
    }
  });
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

exports.issues = function(req, res, next) {
  var ghrepo = getRepo(req);
  ghrepo.issues(req.params.page, function(err, data) {
    if(err) {
      next(err);
    } else {
      res.jsonp(filter(data, ISSUES_FILTER));
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

exports.issue = function(req, res, next) {
  var ghissue = getIssue(req);
  ghissue.info(function(err, data) {
    if(err) {
      next(err);
    } else {
      res.jsonp(filter(data, ISSUE_FILTER));
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

exports.comments = function(req, res, next) {
  var ghissue = getIssue(req);
  ghissue.comments(function(err, data) {
    if(err) {
      next(err);
    } else {
      res.jsonp(filter(data, COMMENT_FILTER));
    }
  });
};

exports.createComment = function(req, res, next) {
  var owner = req.params.owner;
  var repo = req.params.repo;
  var number = req.params.number;
  var body = req.body;

  var options = {
    host: 'api.github.com',
    path: '/repos/' + owner + '/' + repo + '/issues/' + number + '/comments',
    method: 'POST',
    headers: {
      "User-Agent": "Legitco/Gimli",
      "Authorization": "token " + req.user.access
    }
  };

  var postCallback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      res.jsonp(filter(JSON.parse(str), COMMENT_FILTER));
    });
  };

  console.log(JSON.stringify(options));

  var apiRequest = http.request(options, postCallback);

  //This is the data we are posting, it needs to be a string or a buffer
  apiRequest.write(JSON.stringify(body));
  apiRequest.end();
};

exports.notice = function(req, res) {
  console.log("Notice: " + JSON.stringify(req.body, null, 2));
  res.jsonp(req.body);
};
