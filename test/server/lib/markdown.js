var events = require('events');
var nock = require('nock');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var markdown = require('../../../server/lib/markdown');

describe('markdown', function() {
  describe('.rawBodyParser()', function() {
    describe('with a random content type', function() {
      var req = {
        headers: {
          "content-type": "text/html"
        }
      };

      it("should call next immediately", function() {
        var next = sinon.mock();
        markdown.rawBodyParser(req, null, next);
        next.verify();
      });
    });

    describe('with a markdown content type', function() {
      it("should call try to slurp the data", function(done) {
        var req = new events.EventEmitter();
        req.headers = { "content-type": "text/plain" };
        req.setEncoding = function(enc) { this.encoding = enc; };

        markdown.rawBodyParser(req, null, function() {
          req.encoding.should.equal('utf8');
          req.rawBody.should.equal('text');
          done();
        });

        req.emit('data', 'text');
        req.emit('end');
      });
    });
  });

  describe('.render()', function() {
    var options = {
      reqHeaders: {
        'User-Agent': 'Legitco/Gimli'
      }
    };

    var markdownNock = nock('https://api.github.com', options)
          .post('/markdown')
          .reply(200, "markdown");

    it('should render markdown using github', function(done) {
      var req = {
        params: {
          owner: 'legitco',
          repo: 'gimli-test'
        },
        rawBody: 'body'
      };

      var res = {
        send: function(text) {
          text.should.equal("markdown");
          done();
        }
      };

      markdown.render(req, res);
    });
  });
});
