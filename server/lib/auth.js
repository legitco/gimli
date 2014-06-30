var passport = require('passport');
var errors = require('../controllers/errors');
var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/user.js');

// Github Config
var github = {
  client: {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET
  }
};

module.exports.serialize = function(user, done) {
  done(null, user.id);
};

module.exports.deserialize = function(id, done) {
  User.findOne({ id: id }, done);
};

passport.serializeUser(module.exports.serialize);
passport.deserializeUser(module.exports.deserialize);

module.exports.handleAuthResponse = function(access, refresh, profile, done) {
  User.findOneAndUpdate(
    { id: profile._json.id },
    { id: profile._json.id,
      name: profile._json.name,
      login: profile._json.login,
      html_url: profile._json.html_url,
      avatar_url: profile._json.avatar_url,
      email: profile._json.email,
      location: profile._json.location,
      access: access },
    { upsert: true },
    done);
};

passport.use(new GitHubStrategy({
  clientID: github.client.id,
  clientSecret: github.client.secret,
  scope: ['repo', 'admin:repo_hook'],
  callbackURL: process.env.GIMLI_REDIRECT_URL
}, module.exports.handleAuthResponse));

module.exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// GET /auth/github
// Use passport.authenticate() as route middleware to authenticate the request.
// The first step in GitHub authentication will involve redirecting the user to
// github.com.  After authorization, GitHubwill redirect the user back to this
// application at /auth/github/callback
module.exports.githubLogin = passport.authenticate('github');

// GET /auth/github/callback
// Use passport.authenticate() as route middleware to authenticate the request.
// If authentication fails, the user will be redirected back to the login page.
// Otherwise, the primary route function function will be called, which, in this
// example, will redirect the user to the home page.
module.exports.githubCallback = passport.authenticate('github', { failureRedirect: '/failure' });
module.exports.githubSuccess = function(req, res) {
  var redirect_url = req.session.redirect_url ? req.session.redirect_url : '/';
  delete req.session.redirect_url;
  res.redirect(redirect_url);
};

module.exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    errors.apiNotLoggedIn(req, res);
  }
};
