var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('auth', function() {
  var auth = require('../../server/lib/auth');

  describe('.githubSuccess()', function() {
    it("should redirect to '/'", function() {
      var res = { redirect: sinon.spy() };

      auth.githubSuccess(null, res);

      res.redirect.should.have.been.calledOnce;
      res.redirect.should.have.been.calledWith('/');
    });
  });

  describe('.serialize', function() {
    var user = {
      id: 6
    };

    it("should save the user id and serialize the user object", function() {
      auth.serialize(user, function(err, id) {
        id.should.equal(6);
      });
    });
  });

  describe('.deserialize', function() {
    before(function(done) {
      var db = require('../../src/lib/db');
      db.set('gimli:user:6:name', 'Kelsin', done);
    });

    it("should load the user object from the id", function() {
      auth.deserialize(6, function(err, user) {
        user.id.should.equal(6);
        user.name.should.equal('Kelsin');
      });
    });
  });

  describe('.handleAuthResponse', function() {
    var profile = {
      _json: {
        id: 7
      }
    };

    it("should return the user object", function() {
      auth.handleAuthResponse(1, 2, profile, function(err, user) {
        user.id.should.equal(7);
      });
    });
  });
});
