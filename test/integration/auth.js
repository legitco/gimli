process.env.GITHUB_CLIENT_ID = "github-client-id";
process.env.GITHUB_CLIENT_SECRET = "github-client-secret";

var app = require('../../server.js');

var chai = require('chai');
var supertestChai = require('supertest-chai');
var request = supertestChai.request;

chai.should();
chai.use(supertestChai.httpAsserts);

describe('/auth/github', function() {
  it('should return 302', function(done) {
    request(app).get('/auth/github').end(function (res) {
      res.should.have.status(302);
      res.should.have.header('Location', 'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgithub%2Fcallback&client_id=github-client-id');
      done();
    });
  });
});

describe('/auth/github/callback', function() {
  it('should return 302', function(done) {
    request(app).get('/auth/github').end(function (res) {
      res.should.have.status(302);
      res.should.have.header('Location', 'https://github.com/login/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgithub%2Fcallback&client_id=github-client-id');
      done();
    });
  });
});

describe('/logout', function() {
  it('should return 302', function(done) {
    request(app).get('/logout').end(function (res) {
      res.should.have.status(302);
      res.should.have.header('Location', '/');
      done();
    });
  });
});
