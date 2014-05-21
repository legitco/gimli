var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var page = require('../../../server/controllers/page');

describe('page', function() {
  describe('.index()', function() {
    it('should return the home page', function() {
      var req = { user: { access: "TOKEN" }};
      var res = { render: function(){}};

      var mock = sinon.mock(res);
      mock.expects("render");

      page.index(req, res);

      mock.verify();
    });
  });
});
