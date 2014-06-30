var mongooseMock = require('mongoose-mock');
var proxyquire = require('proxyquire');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('auth', function() {
  var User = require('../../../server/models/user');
  var UserMock = sinon.mock(User);
  var auth = proxyquire('../../../server/lib/auth', { '../models/user.js': UserMock });
  var errors = require('../../../server/controllers/errors');

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
    it("should load the user object from the id", function(done) {
      var user = {id: 'test'};

      UserMock.expects("findOne").once().withArgs({ id: '6' }).callsArgWith(1, null, user);

      auth.deserialize('6', function(err, user) {
        user.id.should.equal('test');
        UserMock.verify();
        UserMock.restore();
        done();
      });
    });
  });

  describe('.handleAuthResponse()', function() {
    it("should return the user object", function(done) {
      var user = {id: 'test'};
      UserMock.expects("findOneAndUpdate").once().callsArgWith(3, null, user);
      auth.handleAuthResponse("token", null, {'_json':{}}, function(err, user) {
        user.id.should.equal('test');
        UserMock.verify();
        UserMock.restore();
        done();
      });
    });
  });

  describe('.ensureAuthenticated()', function() {
    it("should call next() if the user is authenticated", function() {
      var req = { isAuthenticated: function() { return true; }};
      var next = sinon.spy();

      auth.ensureAuthenticated(req, null, next);

      next.should.have.been.calledOnce;
    });

    it("should return a 403 if the user is not authenticated", function() {
      var req = { isAuthenticated: function() { return false; }};
      var mock = sinon.mock(errors);

      mock.expects("apiNotLoggedIn").once();

      auth.ensureAuthenticated(req, null, null);

      mock.verify();
      mock.restore();
    });
  });
});
