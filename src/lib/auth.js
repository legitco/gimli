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

passport.serializeUser(function(githubUser, done) {
  user.save(githubUser, function() {
    done(null, githubUser._json.id);
  });
});

passport.deserializeUser(function(id, done) {
  user.load(id, function(user) {
    done(null, user);
  });
});

passport.use(new GitHubStrategy({
  clientID: github.client.id,
  clientSecret: github.client.secret,
  callbackURL: process.env.GIMLI_REDIRECT_URL
}, function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    return done(null, profile);
  });
}));

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
