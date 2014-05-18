var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('repos', function() {
  var repos = require('../../server/controllers/repos');
  var github = require('../../server/lib/github');

  var callback = {next: function(err) {}};

  describe('.index()', function() {
    var req = {
      user: {
        access: "token"
      },
      query: {
        page: 2
      }
    };

    var res = {
      json: function(body) {}
    };

    it('should return data from the github api', function() {
      var stub = sinon.stub(github, "repos");
      stub.callsArgWith(2, null, "result");

      var mock = sinon.mock(res);
      mock.expects("json").withArgs("result");

      repos.index(req, res, null);

      mock.verify();
      mock.restore();
      stub.restore();
    });

    it('should default to page 1', function() {
      req = {
        user: {
          access: "token"
        },
        query: {}
      };

      var mock = sinon.mock(github);
      mock.expects("repos").withArgs(req.user, 1);

      repos.index(req, res, null);

      mock.verify();
      mock.restore();
    });

    it('should error if the github api errors', function() {
      var stub = sinon.stub(github, "repos");
      stub.callsArgWith(2, "ERROR", null);

      var obj = {next: function(err) {}};
      var mock = sinon.mock(obj);
      mock.expects("next").withArgs("ERROR");
      repos.index(req, res, obj.next);
      mock.verify();
      mock.restore();
      stub.restore();
    });
  });

  describe('.subscribe()', function() {
    var req = {
      user: {
        access: "token"
      },
      params: {
        owner: "legitco",
        repo: "gimli"
      }
    };

    var res = {
      json: function(body) {}
    };

    it('should return data from the github api', function() {
      var stub = sinon.stub(github, "subscribe");
      stub.callsArgWith(3, null, "result");

      var mock = sinon.mock(res);
      mock.expects("json").withArgs("result");

      repos.subscribe(req, res, null);

      mock.verify();
      mock.restore();
      stub.restore();
    });

    it('should error if the github api errors', function() {
      var stub = sinon.stub(github, "subscribe");
      stub.callsArgWith(3, "ERROR", null);

      var obj = {next: function(err) {}};
      var mock = sinon.mock(obj);
      mock.expects("next").withArgs("ERROR");
      repos.subscribe(req, res, obj.next);
      mock.verify();
      mock.restore();
      stub.restore();
    });
  });
});
