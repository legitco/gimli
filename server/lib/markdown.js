var http = require('https');

exports.rawBodyParser = function(req, res, next) {
  var contentType = req.headers['content-type'] || '';
  var mime = contentType.split(';')[0];

  if (mime !== 'text/plain' && mime !== 'application/x-markdown') {
    return next();
  }

  var data = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    req.rawBody = data;
    next();
  });
};

exports.render = function(req, res) {
  var owner = req.params.owner;
  var repo = req.params.repo;
  var markdown = req.rawBody;

  var body = {
    text: markdown,
    mode: "gfm",
    context: owner + "/" + repo
  };

  var options = {
    host: 'api.github.com',
    path: '/markdown',
    method: 'POST',
    headers: {
      "User-Agent": "Legitco/Gimli"
    }
  };

  var postCallback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      res.send(str);
    });
  };

  var apiRequest = http.request(options, postCallback);

  //This is the data we are posting, it needs to be a string or a buffer
  apiRequest.write(JSON.stringify(req));
  apiRequest.end();
};
