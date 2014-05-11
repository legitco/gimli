exports.notFound = function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
};

exports.log = function(err, req, res, next) {
  console.error(err.stack);
  next(err);
};

exports.error = function(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
};
