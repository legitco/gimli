var auth = require('./lib/auth');

var api = require('./controllers/api');
var page = require('./controllers/page');
var github = require('./controllers/github');
var errors = require('./controllers/errors');
var markdown = require('./lib/markdown');

module.exports = function(app) {
  // Index
  app.get('/', page.index);

  // Test Error
  app.get('/error', function(req, res, next) {
    next(new Error('Test Error'));
  });

  // Auth
  app.get('/logout', auth.logout);
  app.get('/login', auth.githubLogin);
  app.get('/auth/github/callback', auth.githubCallback, auth.githubSuccess);

  // Jade Partials for Angular Templates
  app.get('/views/*', function(req, res) {
    res.render(req.path.substr(7));
  });

  // API Routes
  app.use('/api', auth.ensureAuthenticated); // Confirm logged in
  app.use('/api', github.client);
  app.get('/api/user', api.user);
  app.get('/api/repos', github.repos);
  app.post('/api/repos/:owner/:repo/subscribe', github.subscribe);
  app.get('/api/:owner/:repo/issues', github.issues);
  app.get('/api/:owner/:repo/issue/:number', github.issue);
  app.get('/api/:owner/:repo/issue/:number/comments', github.comments);
  app.post('/api/:owner/:repo/markdown', markdown.render);
  app.use('/api', errors.apiNotFound);

  // Github Notifications
  app.post('/notice/issue', github.notice);

  // Serve root index page for all other routes
  app.use(page.index);

  // Error Handling
  app.use(errors.log);
  app.use('/api', errors.apiError);
  app.use(errors.error);
};
