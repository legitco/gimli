var app = require('../../server.js');

var chai = require('chai');
var supertestChai = require('supertest-chai');
var request = supertestChai.request;

chai.should();
chai.use(supertestChai.httpAsserts);

describe('/issues', function() {
  it('should return 200', function(done) {
    request(app).get('/issues').end(function (res) {
      res.should.have.status(200);
      done();
    });
  });

  it('should be html', function(done) {
    request(app).get('/issues').end(function (res) {
      res.should.be.html;
      done();
    });
  });
});
