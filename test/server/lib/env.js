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
      expect(method.bind( 1 ) ).to.throw(Error);
      expect(method.bind( "String test" )).to.throw(Error);
      expect(method.bind( {biz: "baz"} )).to.throw(Error);
    });

    it('should throw an error when called with an unset env var', function(){
      expect(method.bind("THIS_IS_NOT_VALID")).to.throw(Error);
      expect(method.bind("ABCDEFGHIJKLMNOPQRSTUVWXYZ")).to.throw(Error);
    });

    it('should match "PWD" and return true', function(){
      expect(method(["PWD"])).to.be.true;
    });
  });

  // describe('.validateInput()', function(){
  //   var methodName = 'validateInput';
  //   var method = (new module())[methodName];

  //   it('should be a method', function(){
  //     expect(module).to.respondTo(methodName);
  //     expect(module).itself.not.to.respondTo(methodName);
  //   });

  //   it('should throw if not provided an array of strings', function(){
  //     expect(method).to.throw(Error);
  //     expect(method.bind(method, [])).to.throw(Error);
  //     expect(method.bind(method, ['test', 1])).to.throw(Error);
  //     expect(method.bind(method, ['test', 'again'])).to.not.throw(Error);
  //   });
  // });

  // it('', function(){});
  // describe('', function(){});
});
