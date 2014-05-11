var path = require('path');
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var errors = require('./src/controllers/errors');

var app = express();

// Config
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'jade');

// Static Content
app.use('/static', express.static(path.join(__dirname, 'dist', 'public')));

// Parse cookies and sessions
app.use(cookieParser());
app.use(session({ secret: process.env.COOKIE_SECRET }));

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Normal Routes
require('./server/routes')(app);

// Error Handling
app.use(errors.notFound);
app.use(errors.log);
app.use(errors.error);

// Serve
var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port %d', server.address().port);
});

module.exports = app;
