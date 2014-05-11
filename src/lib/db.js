var url = require('url');
var redis = null;

if (process.env.NODE_ENV === "test") {
  redis = require('fakeredis');
} else {
  redis = require('redis');
}

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});

// Auth if we need to.
if(redisURL.auth !== null && redisURL.auth.trim() !== "") {
    client.auth(redisURL.auth.split(":")[1]);
}

module.exports = client;
