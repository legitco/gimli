var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Env', function() {
  var module = require('../../../server/lib/env');

  it("should export a module", function(){
    expect(module)
      .to.exist;
  });

  describe('.isEnvVarDefined()', function(){
    var methodName = 'isEnvVarDefined';
    var method = (new module())[methodName];

    it('should be a method', function() {
      expect(module).to.respondTo(methodName);
      expect(module).itself.not.to.respondTo(methodName);
    });

    it('should return a (boolean) value', function(){
      expect(method()).to.be.a('boolean');
    });

    it('should not match non-existant env vars', function(){
      expect(method("THIS_IS_NOT_VALID")).to.be.false;
      expect(method("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).to.be.false;
    });

    it('should match "PORT"', function(){
      expect(method("PORT")).to.be.true;
    });
  });

  describe('.validateInput()', function(){
    var methodName = 'validateInput';
    var method = (new module())[methodName];

    it('should be a method', function(){
      expect(module).to.respondTo(methodName);
      expect(module).itself.not.to.respondTo(methodName);
    });

    it('should throw if not provided an array of strings', function(){
      expect(method).to.throw(Error);
      expect(method.bind(method, [])).to.throw(Error);
      expect(method.bind(method, ['test', 1])).to.throw(Error);
      expect(method.bind(method, ['test', 'again'])).to.not.throw(Error);
    });
  });

  // it('', function(){});
  // describe('', function(){});
});
