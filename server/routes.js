var resources = require('./lib/resources');
var auth = require('./lib/auth');

var page = require('./controllers/page');
var issues = require('./controllers/issues');
var repos = require('./controllers/repos');

module.exports = function(app) {
  resources.init(app);

  app.get('/', page.index);

  // Auth
  app.get('/logout', auth.logout);
  app.get('/login', auth.githubLogin);
  app.get('/auth/github/callback', auth.githubCallback, auth.githubSuccess);

  // Repos
  app.get('/repos', repos);
  app.get('/repos/:page', repos);

  // Issues
  app.get('/subscribe/:owner/:repo', issues.subscribe);
  app.post('/notice/issue', issues.notifications.issue);
  app.post('/notice/issue/comment', issues.notifications.comment);

  // Test Error
  app.get('/error', function(req, res, next) {
    next(new Error('Test Error'));
  });
};
