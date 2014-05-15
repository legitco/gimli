var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('issues', function() {
  var issues = require('../../server/controllers/issues');

  beforeEach(function(done) {
    sinon.stub(console, "log");
    done();
  });

  afterEach(function(done) {
    console.log.restore();
    done();
  });

  describe('.subscribe()', function() {
    var needle = require('needle');

    it("should attempt to subscribe you to issues and comments", function() {
      var req = {
        user: {
          access: "token"
        },
        params: {
          owner: "owner",
          repo: "repo"
        }
      };

      var res = { json: function (body) {} };
      var mock = sinon.mock(res);
      mock.expects('json').once();

      needleMock = sinon.mock(needle, "post");
      needleMock.expects('post').twice().callsArgWith(3, null, {body: {test: "data"}});

      issues.subscribe(req, res);

      needleMock.verify();
      needleMock.restore();
      mock.verify();
    });
  });

  describe('.notifications', function() {
    var req = {
      body: {
        test: "data"
      }
    };

    describe('.issue()', function() {
      it("should pass the body into the response", function() {
        var res = { send: function (body) {} };
        var mock = sinon.mock(res);
        mock.expects('send').once();

        issues.notifications.issue(req, res);

        mock.verify();
      });
    });

    describe('.comment()', function() {
      it("should pass the body into the response", function() {
        var res = { send: function (body) {} };
        var mock = sinon.mock(res);
        mock.expects('send').once();

        issues.notifications.comment(req, res);

        mock.verify();
      });
    });
  });
});
