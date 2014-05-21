var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('auth', function() {
  var auth = require('../../../server/lib/auth');

  describe('.logout()', function() {
    it("should logout and redirect to '/'", function() {
      var req = {
        logout: function(){}
      };
      var res = {
        redirect: function(){}
      };

      var reqMock = sinon.mock(req);
      reqMock.expects("logout");

      var resMock = sinon.mock(res);
      resMock.expects("redirect").withArgs("/");

      auth.logout(req, res);

      reqMock.verify();
      resMock.verify();
    });
  });

  describe('.githubSuccess()', function() {
    it("should redirect to '/'", function() {
      var req = { session: {}};
      var res = { redirect: sinon.spy() };

      auth.githubSuccess(req, res);

      res.redirect.should.have.been.calledOnce;
      res.redirect.should.have.been.calledWith('/');
    });

    it("should redirect to session.redirect_url if provided", function() {
      var req = {
        session: {
          redirect_url: "/url"
        }
      };
      var res = {
        redirect: sinon.spy()
      };

      auth.githubSuccess(req, res);

      res.redirect.should.have.been.calledOnce;
      res.redirect.should.have.been.calledWith('/url');
    });
  });

  describe('.serialize()', function() {
    var user = {
      id: 6
    };

    it("should save the user id and serialize the user object", function() {
      auth.serialize(user, function(err, id) {
        id.should.equal(6);
      });
    });
  });

  describe('.deserialize()', function() {
    before(function(done) {
      var db = require('../../../server/lib/db');
      db.set('gimli:user:6:name', 'Kelsin', done);
    });

    it("should load the user object from the id", function() {
      auth.deserialize(6, function(err, user) {
        user.id.should.equal(6);
        user.name.should.equal('Kelsin');
      });
    });
  });

  describe('.handleAuthResponse()', function() {
    var profile = {
      _json: {
        id: 7
      }
    };

    it("should return the user object", function() {
      auth.handleAuthResponse("token", null, profile, function(err, user) {
        user.id.should.equal(7);
      });
    });
  });
});
