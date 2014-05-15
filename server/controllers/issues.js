// var client = require('../lib/db.js');
var needle = require('needle');

module.exports.index = function(req, res) {
  res.render('issues/index', {
    title : 'Issues',
    user: req.user
  });
};

function sub(user, topic, callback) {
  var options = {
    username: user.access,
    password: "x-oauth-basic"
  };

  needle.post('https://api.github.com/hub',
              { "hub.mode": "subscribe",
                "hub.topic": topic,
                "hub.callback": callback },
              options,
              function(err, resp) {
                console.log(resp.body);
              });
}

module.exports.subscribe = function(req, res) {
  var owner = req.params.owner;
  var repo = req.params.repo;

  var issuesTopic = 'https://github.com/' + owner + '/' + repo + '/events/issues.json';
  var issuesCallback = 'https://gim-legit.herokuapp.com/notice/issue';

  var issueCommentTopic = 'https://github.com/' + owner + '/' + repo + '/events/issue_comment.json';
  var issueCommentCallback = 'https://gim-legit.herokuapp.com/notice/issue/comment';

  sub(req.user, issuesTopic, issuesCallback);
  sub(req.user, issueCommentTopic, issueCommentCallback);

  res.json([{ topic: issuesTopic, callback: issuesCallback },
            { topic: issueCommentTopic, callback: issueCommentCallback }]);
};


module.exports.notifications = {
  issue: function(req, res) {
    console.log("Issue: " + JSON.stringify(req.body, null, 2));
    res.send(req.body);
  },
  comment: function(req, res) {
    console.log("Comment: " + JSON.stringify(req.body, null, 2));
    res.send(req.body);
  }
};
