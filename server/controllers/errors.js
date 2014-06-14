exports.apiNotFound = function(req, res) {
  res.status(404);
  res.json({ status: 404, error: 'Not Found' });
};

exports.apiNotLoggedIn = function(req, res) {
  res.status(403);
  res.json({ status: 403, error: 'Not Logged In' });
};

exports.log = function(err, req, res, next) {
  console.error(err.stack);
  next(err);
};

exports.apiError = function(err, req, res, next) {
  res.status(500);
  res.jsonp({ name: err.name, error: err.message });
};

exports.error = function(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
};
