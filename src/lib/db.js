var redis = require('redis');
var url = require('url');

var redisURL = url.parse(process.env.REDISCLOUD_URL);
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});

// Auth if we need to.
if(redisURL.auth !== null && redisURL.auth.trim() !== "") {
    client.auth(redisURL.auth.split(":")[1]);
}

module.exports = client;
