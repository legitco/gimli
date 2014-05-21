chai.should();
var expect = chai.expect;

describe('Unit: Gimli client app', function(){
  // Our tests will go here
  beforeEach(module('gimli'));

  describe('IssuesController', function() {

    // inject the $controller and $rootScope services in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
      // Create a new scope that's a child of the $rootScope
      scope = $rootScope.$new();
      // Create the controller
      ctrl = $controller('IssuesController', {
        $scope: scope
      });
    }));

    it('should exist', function() {
      expect(scope.issues.length).to.be.empty;
    });

  }); // IssuesController

}); // gimli


// describe('Unit: MainController', function() {
//   // Our tests will go here
//   beforeEach(module('myApp'));

//   var ctrl, scope;
//   // inject the $controller and $rootScope services in the beforeEach block
//   beforeEach(inject(function($controller, $rootScope) {
//     // Create a new scope that's a child of the $rootScope
//     scope = $rootScope.$new();
//     // Create the controller
//     ctrl = $controller('MainController', {
//       $scope: scope
//     });
//   }));

//   it('should create $scope.greeting when calling sayHello',
//     function() {
//       expect(scope.greeting).to.be.undefined;
//       scope.sayHello();
//       expect(scope.greeting).to.equal("Hello Ari");
//   });

// })
