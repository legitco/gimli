var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('repos', function() {
  var repos = require('../../server/controllers/repos');

  var ghme = {
    repos: function(page, callback) {
      callback(null, "result");
    }
  };
  var client = {
    me: function() {
      return ghme;
    }
  };

  var github = require('octonode');
  sinon.stub(github, "client").returns(client);

  var req = {
    user: {
      access: "token"
    },
    params: {
      page: 2
    }
  };

  var res = {
    json: function(body) {}
  };

  it('should return "result"', function() {
    var mock = sinon.mock(res);
    mock.expects("json").withArgs("result");
    repos(req, res, null);
    mock.verify();
  });

  it('should default to page 1', function() {
    req = {
      user: {
        access: "token"
      },
      params: {}
    };

    var mock = sinon.mock(ghme);
    mock.expects("repos").withArgs(1);
    repos(req, res, null);
    mock.verify();
  });
});
