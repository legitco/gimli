var chai = require('chai');
var db = require('../../src/lib/db');
chai.should();

describe('user', function() {
  var user = require('../../src/models/user');

  // Clear db on each run
  beforeEach(function(done) {
    db.flushdb(done);
  });

  var githubProfile = {
    id: 5,
    displayName: "Test User",
    username: "testuser"
  };

  describe('.save()', function() {
    beforeEach(function() {
      user.save(githubProfile);
    });

    it("should save displayName to redis", function() {
      db.get('gimli:user:5:displayName', function(err, reply) {
        reply.should.equal("Test User");
      });
    });

    it("should save username to redis", function() {
      db.get('gimli:user:5:username', function(err, reply) {
        reply.should.equal("testuser");
      });
    });
  });

  describe('.load()', function() {
    beforeEach(function() {
      user.save(githubProfile);
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
        loadedUser.displayName.should.equal("Test User");
        loadedUser.username.should.equal("testuser");
        done();
      });
    });
  });
});
