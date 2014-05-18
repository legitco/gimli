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

  var ghissue = {
    info: function(callback) {
      callback(null, "issue");
    },
    comments: function(callback) {
      callback(null, "comments");
    }
  };

  var client = {
    me: function() { return ghme; },
    repo: function(repo) { return ghrepo; },
    issue: function(repo, number) { return ghissue; }
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
    it('should call the issues github api command', function(done) {
      var mock = sinon.mock(ghrepo);
      mock.expects("issues").callsArgWith(1, null, "result");
      github.issues(user, "legitco", "gimli", 1, function(err, reply) {
        reply.should.equal("result");
        mock.verify();
        mock.restore();
        done();
      });
    });

    it('should filter the response down', function(done) {
      var mock = sinon.mock(ghrepo);
      mock.expects("issues").callsArgWith(1, null, {
        html_url: 'test',
        test: true
      });

      github.issues(user, "legitco", "gimli", 1, function(err, reply) {
        reply.should.deep.equal({
          url: 'test'
        });

        mock.verify();
        mock.restore();
        done();
      });
    });

    it('should return any errors recieved', function(done) {
      var mock = sinon.mock(ghrepo);
      mock.expects("issues").callsArgWith(1, "ERROR", null);

      github.issues(user, "legitco", "gimli", 1, function(err, reply) {
        err.should.equal("ERROR");
        mock.verify();
        mock.restore();
        done();
      });
    });
  });

  describe('.issue()', function() {
    it('should call the issue.info github api command', function(done) {
      var mock = sinon.mock(ghissue);
      mock.expects("info").callsArgWith(0, null, "result");
      github.issue(user, "legitco", "gimli", 1, function(err, reply) {
        reply.should.equal("result");
        mock.verify();
        mock.restore();
        done();
      });
    });

    it('should filter the response down', function(done) {
      var mock = sinon.mock(ghissue);
      mock.expects("info").callsArgWith(0, null, {
        state: 'open',
        html_url: 'test',
        test: true
      });

      github.issue(user, "legitco", "gimli", 1, function(err, reply) {
        reply.should.deep.equal({
          state: 'open',
          url: 'test'
        });

        mock.verify();
        mock.restore();
        done();
      });
    });

    it('should return any errors recieved', function(done) {
      var mock = sinon.mock(ghissue);
      mock.expects("info").callsArgWith(0, "ERROR", null);

      github.issue(user, "legitco", "gimli", 1, function(err, reply) {
        err.should.equal("ERROR");
        mock.verify();
        mock.restore();
        done();
      });
    });
  });

  describe('.comments()', function() {
    it('should call the issue.comments github api command', function(done) {
      var mock = sinon.mock(ghissue);
      mock.expects("comments").callsArgWith(0, null, "result");
      github.comments(user, "legitco", "gimli", 1, function(err, reply) {
        reply.should.equal("result");
        mock.verify();
        mock.restore();
        done();
      });
    });

    it('should filter the response down', function(done) {
      var mock = sinon.mock(ghissue);
      mock.expects("comments").callsArgWith(0, null, {
        id: 1,
        html_url: 'test',
        test: true
      });

      github.comments(user, "legitco", "gimli", 1, function(err, reply) {
        reply.should.deep.equal({
          id: 1,
          url: 'test'
        });

        mock.verify();
        mock.restore();
        done();
      });
    });

    it('should return any errors recieved', function(done) {
      var mock = sinon.mock(ghissue);
      mock.expects("comments").callsArgWith(0, "ERROR", null);

      github.comments(user, "legitco", "gimli", 1, function(err, reply) {
        err.should.equal("ERROR");
        mock.verify();
        mock.restore();
        done();
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
