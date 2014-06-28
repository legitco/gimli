var mongooseMock = require('mongoose-mock');
var proxyquire = require('proxyquire');
var chai = require('chai');
var redis = require('../../../server/lib/redis');
chai.should();

describe('user', function() {
  it('should not be null', function() {
    var User = proxyquire('../../../server/models/user', { 'mongoose': mongooseMock });
    User.should.not.be.null;
  });
});
