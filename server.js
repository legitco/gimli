// Node.js Modules
var fs = require('fs');

// NPM Modules
var colors = require('colors');
var path = require('path');
var express = require('express');
var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// DB
var mongoose = require('mongoose');

// Custom modules
var env = require('./server/lib/env');
var markdown = require('./server/lib/markdown');

// Validate environment variables
try {
  env.validate([
    'COOKIE_SECRET',
    'GIMLI_REDIRECT_URL',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'NODE_ENV',
    'REDIS_URL',
    'MONGO_URL'
  ]);
} catch(err) {
  console.error(err.message.underline.red);
  console.error("Shutting down due to invalid env configuration".red);
  process.exit(1);
}

// Connect to the DB
mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL);
var mongo = mongoose.connection;
mongo.on('error', function(err) {
  console.error('Error connecting to mongodb'.red + ': ' + err.message);
  process.exit(1);
});
mongo.once('open', function callback () {
  console.log('Connected to '.yellow + process.env.MONGO_URL.magenta);
});

// Express yoself
var app = express();

// Config
app.set('views', path.join(__dirname, 'server', 'views'));
app.set('view engine', 'jade');

// Static Content
app.use('/static', express.static(path.join(__dirname, 'dist', 'static')));
app.use('/static', function(req, res) {
  res.status(404);
  res.render('404', { url: req.originalUrl });
});

// Parse cookies and sessions
app.use(cookieParser());
app.use(session({
  store: new RedisStore({
    url: process.env.REDIS_URL
  }),
  secret: process.env.COOKIE_SECRET
}));

// Body Parsing
app.use(markdown.rawBodyParser);
app.use(bodyParser());

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Serve
var socket = process.env.GIMLI_SOCKET;
var port   = process.env.OPENSHIFT_NODEJS_PORT || process.env.GIMLI_PORT || 3000;
var ip     = process.env.OPENSHIFT_NODEJS_IP || process.env.GIMLI_IP || "127.0.0.1";
var server = null;

if (socket) {
  // Make sure the socket is gone before trying to create another
  fs.unlink(socket, function (err) {
    server = app.listen(socket, function() {
      console.log('Listening on socket %s', socket);
    });
    fs.chmod(socket, '0660');
  });
} else {
  server = app.listen(port, ip, function() {
    console.log('Listening on port '.yellow +  port.toString().magenta + ' and ip '.yellow + ip.magenta);
    console.log('You have my sword, my shield ... and my '.blue + 'axe'.red + '!'.blue);
  });
}

var bayeux = require('./server/lib/faye');
bayeux.attach(server);

// Normal Routes
var router = require('./server/router')(app);
module.exports = app;
