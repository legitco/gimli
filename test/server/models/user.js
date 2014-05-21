var chai = require('chai');
var db = require('../../../server/lib/db');
chai.should();

describe('user', function() {
  var user = require('../../../server/models/user');

  var githubProfile = {
    _json: {
      id: 5,
      name: "Test User",
      login: "testuser"
    }
  };

  // Clear db on each run
  beforeEach(function(done) {
    db.flushdb(done);
  });

  describe('.save()', function() {
    beforeEach(function(done) {
      user.save(githubProfile, 'token', done);
    });

    it("should save name to redis", function() {
      db.get('gimli:user:5:name', function(err, reply) {
        (reply === null).should.be.false;
        reply.should.equal("Test User");
      });
    });

    it("should save login to redis", function() {
      db.get('gimli:user:5:login', function(err, reply) {
        (reply === null).should.be.false;
        reply.should.equal("testuser");
      });
    });

    it("should save the access token to redis", function() {
      db.get('gimli:user:5:access', function(err, reply) {
        (reply === null).should.be.false;
        reply.should.equal("token");
      });
    });
  });

  describe('.load()', function() {
    beforeEach(function(done) {
      user.save(githubProfile, 'token', done);
    });

    it("should return null if asked to load null", function(done) {
      user.load(null, function(loadedUser) {
        (loadedUser === null).should.be.true;
        done();
      });
    });

    it("should return null if asked to load undefined", function(done) {
      user.load(undefined, function(loadedUser) {
        (loadedUser === null).should.be.true;
        done();
      });
    });

    it("should retrieve all data on load", function(done) {
      user.load(5, function(loadedUser) {
        loadedUser.id.should.equal(5);
        loadedUser.name.should.equal("Test User");
        loadedUser.login.should.equal("testuser");
        loadedUser.access.should.equal("token");
        done();
      });
    });
  });
});
