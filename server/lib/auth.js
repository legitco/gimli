var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var user = require('../models/user.js');

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
  user.load(id, function(user) {
    done(null, user);
  });
};

passport.serializeUser(module.exports.serialize);
passport.deserializeUser(module.exports.deserialize);

module.exports.handleAuthResponse = function(access, refresh, profile, done) {
  user.save(profile, function() {
    user.load(profile._json.id, function(user) {
      done(null, user);
    });
  });
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
  res.redirect('/');
};
