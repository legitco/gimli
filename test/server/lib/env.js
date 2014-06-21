var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Env', function() {
  var module = require('../../../server/lib/env');

  it("should export a module", function(){
    expect(module).to.exist;
  });

  describe('.validate()', function(){
    var methodName = 'validate';
    var method = module[methodName];

    it('should be a function', function() {
      expect(method).to.exist;
      expect(method).to.be.a('function');
    });

    it('should throw an error if called with no param, a Number, a string, or an object', function(){
      expect(method).to.throw(Error);
      expect(method.bind(method, 1)).to.throw(Error);
      expect(method.bind(method, "String test")).to.throw(Error);
      expect(method.bind(method, {biz: "baz"})).to.throw(Error);
    });

    it('should throw an error when called with an invalid array', function(){
      expect(method.bind(method, [1])).to.throw(Error);
      expect(method.bind(method, [{fizz: "buzz"}])).to.throw(Error);
    });

    it('should throw an error when called with an unset env var', function(){
      expect(method.bind(method, ["THIS_IS_NOT_VALID"])).to.throw(Error);
      expect(method.bind(method, ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"])).to.throw(Error);
      expect(method.bind(method, ["PATH", "INVALID_ENV_VAR"])).to.throw(Error);
    });

    it('should match "PATH" and return true', function(){
      expect(method.bind(method, ["PATH"])).to.not.throw(Error);
      expect(method(["PATH"])).to.be.true;
    });
  });

  // it('', function(){});
  // describe('', function(){});
});
