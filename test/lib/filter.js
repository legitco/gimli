var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);

var filter = require('../../server/lib/filter');

describe('filter()', function() {
  var data = {
    name: 'Gimli',
    nested: {
      book: 5,
      title: "Foo"
    },
    array: [{
      one: 1,
      two: 2
    },{
      one: 'one',
      two: 'two'
    }],
    title: 'Gimli Title'
  };

  it("should not affect the original input", function() {
    var output = filter(data, {});
    data.should.deep.equal({
      name: 'Gimli',
      nested: {
        book: 5,
        title: "Foo"
      },
      array: [{
        one: 1,
        two: 2
      },{
        one: 'one',
        two: 'two'
      }],
      title: 'Gimli Title'
    });
  });

  it("should filter fields that aren't included", function() {
    var output = filter(data, {name: true});
    output.should.deep.equal({name: 'Gimli'});
  });

  it("should correctly handle nested fields", function() {
    var output = filter(data, {nested: {book: true}});
    output.should.deep.equal({nested: {book: 5}});
  });

  it("should correctly handle array fields", function() {
    var output = filter(data, {array: {one: true}});
    output.should.deep.equal({array: [{one: 1},{one: 'one'}]});
  });

  it("should handle simple renames", function() {
    var output = filter(data, {name: "author"});
    output.should.deep.equal({author: 'Gimli'});
  });

  it("should handle deep renames", function() {
    var output = filter(data, {nested: {_rename: "foo", book: "script"}});
    output.should.deep.equal({foo: {script: 5}});
  });

  it("should handle renames in arrays", function() {
    var output = filter(data, {array: {_rename: "bar", one: "three"}});
    output.should.deep.equal({bar: [{three: 1},{three: 'one'}]});
  });
});
