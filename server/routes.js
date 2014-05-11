var resources = require('./lib/resources');
var auth = require('./lib/auth');

var page = require('./controllers/page');
var issues = require('./controllers/issues');

module.exports = function(app) {
  resources.init(app);

  app.get('/', page.index);

  // Auth
  app.get('/logout', auth.logout);
  app.get('/login', auth.githubLogin);
  app.get('/auth/github/callback', auth.githubCallback, auth.githubSuccess);

  // Resources
  resources.resource('/issues', issues);

  // Test Error
  app.get('/error', function(req, res, next) {
    next(new Error('Test Error'));
  });
};
