var chai = require('chai');
var db = require('../../src/lib/db');
chai.should();

describe('user', function() {
  var user = require('../../src/models/user');

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
      user.save(githubProfile, done);
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
  });

  describe('.load()', function() {
    beforeEach(function(done) {
      user.save(githubProfile, done);
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
        done();
      });
    });
  });
});
