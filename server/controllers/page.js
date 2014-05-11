module.exports.index = function(req, res) {
  res.render('index', {
    title : 'Home',
    user: req.user
  });
};
