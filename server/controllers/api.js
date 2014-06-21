exports.user = function(req, res) {
  res.jsonp(req.user);
};
