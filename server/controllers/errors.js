exports.apiNotFound = function(req, res, next) {
  res.status(404);
  res.json({ status: 404, error: 'Not Found' });
};

exports.notFound = function(req, res, next) {
  res.status(404);
  res.render('404');
};

exports.log = function(err, req, res, next) {
  console.error(err.stack);
  next(err);
};

exports.apiError = function(err, req, res, next) {
  res.status(500);
  res.json({ name: err.name, error: err.message });
};

exports.error = function(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
};
