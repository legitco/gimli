var app = require('../../server.js');

var chai = require('chai');
var supertestChai = require('supertest-chai');
var sinon = require('sinon');
var request = supertestChai.request;

chai.should();
chai.use(supertestChai.httpAsserts);

describe('/page-that-does-not-exist', function() {
  it('should return 404 as html', function(done) {
    request(app)
      .get('/page-that-does-not-exist')
      .set('Accept', 'text/html')
      .end(function (res) {
        res.should.have.status(404);
        res.should.have.header('Content-Type', 'text/html; charset=utf-8');
        done();
    });
  });

  it('should return 404 as json', function(done) {
    request(app)
      .get('/page-that-does-not-exist')
      .set('Accept', 'application/json')
      .end(function (res) {
        res.should.have.status(404);
        res.should.have.header('Content-Type', 'application/json');
        done();
    });
  });

  it('should return 404 as text', function(done) {
    request(app)
      .get('/page-that-does-not-exist')
      .set('Accept', 'text/plain')
      .end(function (res) {
        res.should.have.status(404);
        res.should.have.header('Content-Type', 'text/plain; charset=utf-8');
        done();
    });
  });

  it('should return 404 as text by default', function(done) {
    request(app)
      .get('/page-that-does-not-exist')
      .set('Accept', 'application/xml')
      .end(function (res) {
        res.should.have.status(404);
        res.should.have.header('Content-Type', 'text/plain; charset=utf-8');
        done();
    });
  });

  it('should log and return 500 when an error occurs', function(done) {
    var mock = sinon.mock(console);
    mock.expects("error").once();

    request(app)
      .get('/error')
      .end(function (res) {
        res.should.have.status(500);
        res.should.have.header('Content-Type', 'text/html; charset=utf-8');
        mock.verify();
        mock.restore();
        done();
      });
  });
});
