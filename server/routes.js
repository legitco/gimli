var resources = require('./lib/resources');
var auth = require('./lib/auth');

var page = require('./controllers/page');
var github = require('./controllers/github');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.redirect_url = req.url;
    res.redirect('/login');
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

  // For any api request, load the client
  app.use('/api', github.client);

  // Repos
  app.get('/api/repos', github.repos);
  app.post('/api/repos/:owner/:repo/subscribe', github.subscribe);

  // Issues
  app.get('/api/:owner/:repo/issues', github.issues);
  app.get('/api/:owner/:repo/issue/:number', github.issue);
  app.get('/api/:owner/:repo/issue/:number/comments', github.comments);

  // Github Notifications
  app.post('/notice/issue', github.notice);

  // Test Error
  app.get('/error', function(req, res, next) {
    next(new Error('Test Error'));
  });
};
