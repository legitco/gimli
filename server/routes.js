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
  app.get('/api/repos', repos.index);
  app.post('/api/repos/:owner/:repo/subscribe', repos.subscribe);

  // Issues
  app.get('/api/:owner/:repo/issues', issues.index);
  app.get('/api/:owner/:repo/issue/:number', issues.show);
  app.get('/api/:owner/:repo/issue/:number/comments', issues.comments);

  // Github Notifications
  app.post('/notice/issue', issues.notice);

  // Test Error
  app.get('/error', function(req, res, next) {
    next(new Error('Test Error'));
  });
};
