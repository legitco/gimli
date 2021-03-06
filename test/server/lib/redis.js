var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('redis', function() {

  describe('in a test environment', function() {

    describe('with an auth string', function() {
      var origRedisCloud = null;

      before(function(done) {
        delete require.cache[require.resolve('../../../server/lib/redis')];
        origRedisCloud = process.env.REDIS_URL;
        process.env.REDIS_URL = "redis://fake:pass@localhost:6379";
        done();
      });

      after(function(done) {
        delete require.cache[require.resolve('../../../server/lib/redis')];
        process.env.REDIS_URL = origRedisCloud;
        done();
      });

      it('should attemp to connect', function() {
        var redis = require('../../../server/lib/redis');
        (redis !== null).should.be.true;
      });
    });
  });

  describe('in a non-test environment', function() {
    var origNodeEnv = null;

    before(function(done) {
      delete require.cache[require.resolve('../../../server/lib/redis')];
      origNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = "development";
      done();
    });

    after(function(done) {
      delete require.cache[require.resolve('../../../server/lib/redis')];
      process.env.NODE_END = origNodeEnv;
      done();
    });

    it("should be able to load the redis client", function() {
      var redis = require('../../../server/lib/redis');
      (redis !== null).should.be.true;
    });
  });
});
