var app = require('../../server.js');

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var supertestChai = require('supertest-chai');
var request = supertestChai.request;

chai.should();
chai.use(sinonChai);
chai.use(supertestChai.httpAsserts);

var github = require('../../server/lib/github');

describe('/api/:owner/:repo/issues', function() {
  it('should call the github api wrapper', function(done) {
    var mock = sinon.mock(github);
    mock.expects("issues")
      .withArgs(undefined, "foo", "bar", 1)
      .callsArgWith(4, null, "result");

    request(app).get('/api/foo/bar/issues').end(function (res) {
      res.should.have.status(200);
      mock.verify();
      mock.restore();
      done();
    });
  });
});
