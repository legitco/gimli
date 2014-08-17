var faye = require('faye');
module.exports = new faye.NodeAdapter({mount: '/faye'});
