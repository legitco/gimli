var express = require('express');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var session = require('express-session');
var cookieParser = require('cookie-parser');


var github = {
  client: {
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET
  }
};

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({ clientID: github.client.id,
                                  clientSecret: github.client.secret,
                                  callbackURL: process.env.GIMLI_REDIRECT_URL},
                                function(accessToken, refreshToken, profile, done) {
                                  // asynchronous verification, for effect...
                                  process.nextTick(function () {
                                    // To keep the example simple, the user's GitHub profile is returned to
                                    // represent the logged-in user.  In a typical application, you would want
                                    // to associate the GitHub account with a user record in your database,
                                    // and return that user instead.
                                    return done(null, profile);
                                  }); } ));

var app = express();

app.use('/static', express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({ secret: process.env.COOKIE_SECRET }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function (req, res) {
  res.render('index', {
    title : 'Home',
    user: req.user
  });
});

// GET /auth/github
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in GitHub authentication will involve redirecting
//   the user to github.com.  After authorization, GitHubwill redirect the user
//   back to this application at /auth/github/callback
app.get('/auth/github', passport.authenticate('github'));

// GET /auth/github/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/github/callback',
        passport.authenticate('github', { failureRedirect: '/failure' }),
        function(req, res) {
          res.redirect('/');
        });

// GET /lgout
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port %d', server.address().port);
});
