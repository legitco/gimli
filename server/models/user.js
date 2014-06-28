var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  id: String,
  name: String,
  login: String,
  html_url: String,
  avatar_url: String,
  email: String,
  location: String,
  access: String
});

module.exports = mongoose.model('User', userSchema);
