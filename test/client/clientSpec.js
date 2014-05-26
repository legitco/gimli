chai.should();
var expect = chai.expect;

describe('Unit: Gimli client app', function() {
  beforeEach(module('gimli'));

  describe('Controllers', function() {
    describe('IssuesController', function() {
      var scope, ctrl, apiData;
      var testOwner = "username";
      var testRepo = "project";
      apiData = [{
          title: 'Issue Title'
        }, {
          title: 'Second issue title'
        }
      ];

      describe('Basic configuration', function(){
        beforeEach(inject(function($controller, $rootScope) {
          scope = $rootScope.$new();

          ctrl = $controller('IssuesController', {
            $scope: scope
          });
        })); // beforeEach

        it('should exist', function () {
          expect(ctrl).to.exist;
          expect(ctrl).to.not.be.undefied;
        });

        it('should have a scope', function() {
          expect(scope)
        });

        it('should initialize with an empty scope', function() {
          expect(scope.issues).to.deep.equal([]);
        })
      }); // describe basic config

      describe('RouteParams integration', function() {
        beforeEach(inject(function($controller, $rootScope) {
          scope = $rootScope.$new();

          ctrl = $controller('IssuesController', {
            $scope: scope,
            $routeParams: { owner: testOwner, repo: testRepo }
          });
        })); // before each

        it('should provide values for the scope\'s "owner" and "repo" properties', function() {
          expect(scope.owner).to.equal(testOwner);
          expect(scope.repo).to.equal(testRepo);
        });
      }); // describe routeparams

      describe('Gimli API service integration', function() {
        beforeEach(inject(function($controller, $rootScope) {
          scope = $rootScope.$new();

          ctrl = $controller('IssuesController', {
            $scope: scope,
            $routeParams: { owner: testOwner, repo: testRepo },
            GimliApiService: {
              getIssues: function(opts, cb) { cb(apiData) }
            }
          });
        })); // before each

        it('IssueController should set "scope.issues" using data from the Gimli API service', function() {
          expect(scope.issues).to.deep.equal(apiData);
        });

      }); // describe gimli api

    });
  });

}); // gimli


// chai.should();
// var expect = chai.expect;

// describe('Unit: Gimli client app', function() {
//   // Our tests will go here
//   beforeEach(module('gimli'));

//   describe('IssuesController', function() {
//     var scope, routeParams, api, ctrl;

//     // inject the $controller and $rootScope services in the beforeEach block
//     beforeEach(inject(function($controller, $rootScope) {
//       // Create a new scope that's a child of the $rootScope
//       scope = $rootScope.$new();
//       routeParams = function() {};

//       gimliApi = function() {};
//       gimliApi.getIssues = function() {};
//       gimliApi.getIssue = function() {};

//       ctrl = $controller('IssuesController', {
//         $scope: scope,
//         $routeParams: routeParams,
//         GimliApiService: gimliApi
//       });
//     })); // beforeEach

//     it('should be availible', function() {
//       expect(ctrl).to.not.be.undefined;
//     });

//     it('should initialize with an empty issue list', function() {
//       expect(scope.issues.length).to.equal(0);
//       expect(scope.issues).to.be.empty;
//     });

//     it('should depend on $scope, $routeParams, and GimliApiService', function() {
//       expect(scope).to.not.be.undefined;
//       // expect(ctrl.$routeParams).to.not.be.undefined;
//     })

//   }); // IssuesController

//   // describe('IssueController', function() {
//   //   // inject the $controller and $rootScope services in the beforeEach block
//   //   beforeEach(inject(function($controller, $rootScope) {
//   //     // Create a new scope that's a child of the $rootScope
//   //     scope = $rootScope.$new();
//   //     // Create the controller
//   //     ctrl = $controller('IssueController', {
//   //       $scope: scope
//   //     });
//   //   })); // beforeEach

//   //   it('should initialize an empty `issue`', function() {
//   //     expect(scope.issue).to.be({});
//   //   });
//   // }); // IssueController

// }); // gimli
