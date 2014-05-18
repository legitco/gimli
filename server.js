var path = require('path');
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errors = require('./server/controllers/errors');

var app = express();

// Config
app.set('views', path.join(__dirname, 'client', 'views'));
app.set('view engine', 'jade');

// Static Content
app.use('/static', express.static(path.join(__dirname, 'dist', 'static')));

// Parse cookies and sessions
app.use(cookieParser());
app.use(session({ secret: process.env.COOKIE_SECRET }));

// Body Parsing
app.use(bodyParser());

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Normal Routes
require('./server/routes')(app);

// Error Handling
app.use('/api', errors.apiNotFound);
app.use(errors.notFound);
app.use(errors.log);
app.use('/api', errors.apiError);
app.use(errors.error);

// Serve
var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port %d', server.address().port);
});

var faye = require('faye');
var bayeux = new faye.NodeAdapter({mount: '/faye'});
bayeux.attach(server);

module.exports = app;
