var resources = require('./lib/resources');
var auth = require('./lib/auth');

var page = require('./controllers/page');
var issues = require('./controllers/issues');
var repos = require('./controllers/repos');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.redirect_url = req.url;
    res.redirect('/login');
  }
}

function apiEnsureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(new Error("Not logged in"));
  }
}

module.exports = function(app) {
  resources.init(app);

  app.get('/', page.index);

  // Auth
  app.get('/logout', auth.logout);
  app.get('/login', auth.githubLogin);
  app.get('/auth/github/callback', auth.githubCallback, auth.githubSuccess);

  // Make sure we're logged in first
  app.use(ensureAuthenticated);

  // Repos
  app.get('/api/repos', apiEnsureAuthenticated, repos.index);
  app.post('/api/repos/:owner/:repo/subscribe', apiEnsureAuthenticated, repos.subscribe);

  // Issues
  app.get('/api/:owner/:repo/issues', apiEnsureAuthenticated, issues.index);
  app.get('/api/:owner/:repo/issue/:number', apiEnsureAuthenticated, issues.show);
  app.get('/api/:owner/:repo/issue/:number/comments', apiEnsureAuthenticated, issues.comments);

  // Github Notifications
  app.post('/notice/issue', issues.notice);

  // Test Error
  app.get('/error', function(req, res, next) {
    next(new Error('Test Error'));
  });
};
