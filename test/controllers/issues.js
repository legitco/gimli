var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var issues = require('../../server/controllers/issues');
var github = require('../../server/lib/github');

var req = {
  body: "result",
  user: {
    access: "TOKEN"
  },
  params: {
    owner: "owner",
    repo: "repo"
  }
};

var res = {
  json: function(){}
};

describe('issues', function() {
  describe('.index()', function() {
    it("should return errors via the next callback", function(done) {
      var mock = sinon.mock(github);
      mock.expects("issues").callsArgWith(4, "ERROR", null);

      issues.index(req, null, function(err) {
        err.should.equal("ERROR");
        mock.verify();
        mock.restore();
        done();
      });
    });
  });

  describe('.show()', function() {
    it("should return errors via the next callback", function(done) {
      var mock = sinon.mock(github);
      mock.expects("issue").callsArgWith(4, "ERROR", null);

      issues.show(req, null, function(err) {
        err.should.equal("ERROR");
        mock.verify();
        mock.restore();
        done();
      });
    });
  });

  describe('.comments()', function() {
    it("should return errors via the next callback", function(done) {
      var mock = sinon.mock(github);
      mock.expects("comments").callsArgWith(4, "ERROR", null);

      issues.comments(req, null, function(err) {
        err.should.equal("ERROR");
        mock.verify();
        mock.restore();
        done();
      });
    });
  });

  describe('.notice()', function() {
    it("should return the request body", function(done) {
      var mock = sinon.mock(res);
      mock.expects("json").withArgs("result");
      issues.notice(req, res, function(){});
      mock.verify();
      mock.restore();
      done();
    });
  });
});
