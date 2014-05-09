var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

describe('Resources', function() {
  var controller = {
    index: function(){},
    create: function(){},
    show: function(){}
  };

  var app = {
    get: sinon.spy(),
    post: sinon.spy()
  };

  var resources = require('../../src/lib/resources');
  resources.init(app);

  describe("resource", function() {
    it("should only make routes for existing methods", function() {
      resources.resource('/foo', controller);

      app.get.should.have.callCount(2);
      app.get.should.have.been.calledWith('/foo', controller.index);
      app.get.should.have.been.calledWith('/foo/:id', controller.show);

      app.post.should.have.been.called;
      app.post.should.have.been.calledWith('/foo', controller.create);
    });
  });
});
