chai.should();
var expect = chai.expect;

describe('Unit: Gimli client app', function() {
  beforeEach(module('gimli'));

  describe('Controllers', function() {
    describe('IssueListController', function() {
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

          ctrl = $controller('IssueListController', {
            $scope: scope
          });
        })); // beforeEach

        it('should exist', function () {
          expect(ctrl).to.exist;
          expect(ctrl).to.not.be.undefined;
        });

        it('should have a scope', function() {
          expect(scope)
        });

        it('should initialize with an empty scope', function() {
          expect(scope.issues).to.deep.equal([]);
        })
      }); // describe basic config

      describe('StateParams integration', function() {
        beforeEach(inject(function($controller, $rootScope) {
          scope = $rootScope.$new();

          ctrl = $controller('IssueListController', {
            $scope: scope,
            $stateParams: { owner: testOwner, repo: testRepo }
          });
        })); // before each

        it('should provide values for the scope\'s "owner" and "repo" properties', function() {
          expect(scope.owner).to.equal(testOwner);
          expect(scope.repo).to.equal(testRepo);
        });
      }); // describe stateParams

      describe('Gimli API service integration', function() {
        beforeEach(inject(function($controller, $rootScope) {
          scope = $rootScope.$new();

          ctrl = $controller('IssueListController', {
            $scope: scope,
            $stateParams: { owner: testOwner, repo: testRepo },
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
