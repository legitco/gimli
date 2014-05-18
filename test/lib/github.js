var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var github = require('../../server/lib/github');

describe('github', function() {
  var user = { access: "TOKEN" };

  var ghme = {
    repos: function(page, callback) {
      callback(null, "repos");
    }
  };

  var ghrepo = {
    issues: function(page, callback) {
      callback(null, "issues");
    },
    hook: function(options, callback) {
      callback(null, "hook");
    }
  };

  var client = {
    me: function() { return ghme; },
    repo: function(repo) { return ghrepo; }
  };

  var octonode = null;

  beforeEach(function(done) {
    octonode = require('octonode');
    var stub = sinon.stub(octonode, "client");
    stub.returns(client);
    done();
  });

  afterEach(function(done) {
    octonode.client.restore();
    done();
  });

  describe('.repos()', function() {
    it('should call the repos github api command', function() {
      sinon.mock(ghme).expects("repos");
      github.repos(user, 1, function(err, reply) {
        reply.should.equal("repos");
        ghme.repos.verify();
        ghme.repos.restore();
      });
    });
  });

  describe('.issues()', function() {
    it('should call the issues github api command', function() {
      sinon.mock(ghrepo).expects("issues");
      github.issues(user, "legitco", "gimli", 1, function(err, reply) {
        reply.should.equal("issues");
        ghrepo.issues.verify();
        ghrepo.issues.restore();
      });
    });
  });

  describe('.subscribe()', function() {
    it('should call the hook github api command', function() {
      sinon.mock(ghrepo).expects("hook");
      github.subscribe(user, "legitco", "gimli", function(err, reply) {
        reply.should.equal("hook");
        ghrepo.hook.verify();
        ghrepo.hook.restore();
      });
    });
  });
});
