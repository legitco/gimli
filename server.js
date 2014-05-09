var path = require('path');
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();

// Middleware
app.use('/static', express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({ secret: process.env.COOKIE_SECRET }));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'jade');

// Routes
require('./src/routes')(app);

// Serve
var server = app.listen(process.env.PORT, function() {
  console.log('Listening on port %d', server.address().port);
});

module.exports = app;
