var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('auth', function() {
  var auth = require('../../src/lib/auth');

  describe('.githubSuccess()', function() {
    it("should redirect to '/'", function() {
      var res = { redirect: sinon.spy() };

      auth.githubSuccess(null, res);

      res.redirect.should.have.been.calledOnce;
      res.redirect.should.have.been.calledWith('/');
    });
  });
});
