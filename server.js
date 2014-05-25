var path = require('path');
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var markdown = require('./server/lib/markdown');

var app = express();

// Config
app.set('views', path.join(__dirname, 'client', 'views'));
app.set('view engine', 'jade');

// Static Content
app.use('/static', express.static(path.join(__dirname, 'dist', 'static')));

// Parse cookies and sessions
app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    url: process.env.REDISCLOUD_URL
  }),
  secret: process.env.COOKIE_SECRET
}));

// Body Parsing
app.use(markdown.rawBodyParser);
app.use(bodyParser());

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Normal Routes
require('./server/routes')(app);

// Serve
var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port %d', server.address().port);
});

var faye = require('faye');
var bayeux = new faye.NodeAdapter({mount: '/faye'});
bayeux.attach(server);

module.exports = app;
