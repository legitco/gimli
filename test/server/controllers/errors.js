var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var errors = require('../../../server/controllers/errors');

var res = {
  status: function(number){},
  json: function(data){},
  jsonp: function(data){},
  render: function(view, data){}
};

var err = {
  stack: "STACK",
  name: "NAME",
  message: "MESSAGE"
};

describe('errors', function() {
  describe('.apiNotFound()', function() {
    it("should return a 404 as json", function() {
      var mock = sinon.mock(res);
      mock.expects("status").withArgs(404);
      mock.expects("jsonp").withArgs({
        status: 404,
        error: 'Not Found'
      });

      errors.apiNotFound(null, res, null);

      mock.verify();
      mock.restore();
    });
  });

  describe('.apiNotLoggedIn()', function() {
    it("should return a 403 as json", function() {
      var mock = sinon.mock(res);
      mock.expects("status").withArgs(403);
      mock.expects("jsonp").withArgs({
        status: 403,
        error: 'Not Logged In'
      });

      errors.apiNotLoggedIn(null, res, null);

      mock.verify();
      mock.restore();
    });
  });

  describe('.log()', function() {
    it("should log the error", function() {
      var mock = sinon.mock(console);
      mock.expects("error").withArgs(err.stack);

      var next = sinon.mock();
      next.withArgs(err);

      errors.log(err, null, null, next);

      mock.verify();
      next.verify();
      mock.restore();
    });
  });

  describe('.apiError()', function() {
    it("should return a 500 with the error", function() {
      var mock = sinon.mock(res);
      mock.expects("status").withArgs(500);
      mock.expects("jsonp").withArgs({
        name: err.name,
        error: err.message
      });

      errors.apiError(err, null, res, null);

      mock.verify();
      mock.restore();
    });
  });

  describe('.error()', function() {
    it("should return a 500 with the error", function() {
      var mock = sinon.mock(res);
      mock.expects("status").withArgs(500);
      mock.expects("render").withArgs('error', { error: err });

      errors.error(err, null, res, null);

      mock.verify();
      mock.restore();
    });
  });
});
