var nock = require('nock');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var github = require('../../../server/controllers/github');
var octonode = require('octonode');

describe('github', function() {
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

  var req = {
    user: { access: "TOKEN" },
    session: { client: client },
    params: {
      owner: 'owner',
      repo: 'repo'
    }
  };

  var res = {
    jsonp: function(){}
  };

  describe('.client()', function() {
    it("should set the client in the session", function(done) {
      var mock = sinon.mock(octonode);
      mock.expects("client").withArgs("TOKEN").returns("client");
      github.client(req, null, function() {
        req.session.client.should.equal("client");
        mock.verify();
        mock.restore();
        req.session.client = client;
        done();
      });
    });
  });

  describe('.subscribe()', function() {
    it('should call the hook github api command', function() {
      var ghrepoMock = sinon.mock(ghrepo);
      ghrepoMock.expects("hook").callsArgWith(1, null, "result");

      var resMock = sinon.mock(res);
      resMock.expects("jsonp").withArgs("result");

      github.subscribe(req, res, function(){});

      ghrepoMock.verify();
      resMock.verify();

      ghrepoMock.restore();
      resMock.restore();
    });

    it('should pass through any errors', function() {
      var ghrepoMock = sinon.mock(ghrepo);
      ghrepoMock.expects("hook").callsArgWith(1, "ERROR", null);

      var nextMock = sinon.mock();
      nextMock.withArgs("ERROR");

      github.subscribe(req, res, nextMock);

      ghrepoMock.verify();
      ghrepoMock.restore();

      nextMock.verify();
    });
  });

  describe('.repos()', function() {
    it('should call the repos github api command', function() {
      var ghmeMock = sinon.mock(ghme);
      ghmeMock.expects("repos").callsArgWith(1, null, "result");

      var resMock = sinon.mock(res);
      resMock.expects("jsonp").withArgs("result");

      github.repos(req, res, function(){});

      ghmeMock.verify();
      ghmeMock.restore();

      resMock.verify();
      resMock.restore();
    });

    it('should pass through any errors', function() {
      var ghmeMock = sinon.mock(ghme);
      ghmeMock.expects("repos").callsArgWith(1, "ERROR", null);

      var nextMock = sinon.mock();
      nextMock.withArgs("ERROR");

      github.repos(req, res, nextMock);

      ghmeMock.verify();
      ghmeMock.restore();

      nextMock.verify();
    });
  });

  describe('.issues()', function() {
    it('should call the issues github api command', function() {
      var mock = sinon.mock(ghrepo);
      mock.expects("issues").callsArgWith(1, null, {html_url: "url"});

      var resMock = sinon.mock(res);
      resMock.expects("jsonp").withArgs({url: "url"});

      github.issues(req, res, function(){});

      mock.verify();
      mock.restore();

      resMock.verify();
      resMock.restore();
    });

    it('should return any errors recieved', function() {
      var mock = sinon.mock(ghrepo);
      mock.expects("issues").callsArgWith(1, "ERROR", null);

      var nextMock = sinon.mock().withArgs("ERROR");

      github.issues(req, null, nextMock);

      mock.verify();
      mock.restore();

      nextMock.verify();
    });
  });

  describe('.issue()', function() {
    it('should call the issue github api command', function() {
      var mock = sinon.mock(ghissue);
      mock.expects("info").callsArgWith(0, null, {html_url: "url"});

      var resMock = sinon.mock(res);
      resMock.expects("jsonp").withArgs({url: "url"});

      github.issue(req, res, function(){});

      mock.verify();
      mock.restore();

      resMock.verify();
      resMock.restore();
    });

    it('should return any errors recieved', function() {
      var mock = sinon.mock(ghissue);
      mock.expects("info").callsArgWith(0, "ERROR", null);

      var nextMock = sinon.mock().withArgs("ERROR");

      github.issue(req, null, nextMock);

      mock.verify();
      mock.restore();

      nextMock.verify();
    });
  });

  describe('.comments()', function() {
    it('should call the issue github api command', function() {
      var mock = sinon.mock(ghissue);
      mock.expects("comments").callsArgWith(0, null, {html_url: "url"});

      var resMock = sinon.mock(res);
      resMock.expects("jsonp").withArgs({url: "url"});

      github.comments(req, res, function(){});

      mock.verify();
      mock.restore();

      resMock.verify();
      resMock.restore();
    });

    it('should return any errors recieved', function() {
      var mock = sinon.mock(ghissue);
      mock.expects("comments").callsArgWith(0, "ERROR", null);

      var nextMock = sinon.mock().withArgs("ERROR");

      github.comments(req, null, nextMock);

      mock.verify();
      mock.restore();

      nextMock.verify();
    });
  });

  describe('.createComment()', function() {
    it('should create a comment and publish it to faye', function(done) {
      var options = {
        reqHeaders: {
          'User-Agent': 'Legitco/Gimli'
        }
      };

      var req = {
        params: {
          owner: 'test',
          repo: 'repo',
          number: '5'
        },
        user: {
          access: 'access'
        }
      };

      var res = {
        jsonp: function(data) {
          data.should.deep.equal({id:"comment"});
          done();
        }
      };

      var createCommentNock = nock('https://api.github.com', options)
            .post('/repos/test/repo/issues/5/comments')
            .reply(200, "{\"id\":\"comment\"}");

      github.createComment(req, res, null);
    });
  });

  describe('.notice()', function() {
    it('should log and return the response', function() {
      var mock = sinon.mock(console);
      mock.expects("log");

      var resMock = sinon.mock(res);
      resMock.expects("jsonp").withArgs("body");

      github.notice({body: "body"}, res, function(){});

      mock.verify();
      mock.restore();

      resMock.verify();
      resMock.restore();
    });
  });
});
