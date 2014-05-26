var gimli = angular.module('gimli', ['ngRoute']);

gimli.service('GimliApiService', ['$q', '$http', function(q, $http) {
  // var opts = {
  //   owner: 'name of the user/org that owns the repo',
  //   repo: 'name of the repository'
  // }
  this.getIssues = function(opts, onSuccess) {
    $http({ method: 'GET', url: '/api/' + opts.owner + '/' + opts.repo + '/issues' })
      .success(onSuccess);
  }

  this.getIssue = function(opts, onSuccess) {
    $http({ method: 'GET', url: '/api/' + opts.owner + '/' + opts.repo + '/issue/' + opts.id })
      .success(onSuccess);
  }
}]);

gimli.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {})
    .when('/:owner/:repo/issues', {
      templateUrl: '/static/templates/issues.html',
      controller: 'IssuesController'
    })
    .when('/:owner/:repo/issue/:id', {
      templateUrl: '/static/templates/issue.html',
      controller: 'IssueController'
    })
    .when('/404', {
      templateUrl: 'static/templates/404.html'
    })
    .otherwise({
      redirectTo: '404'
    })
});

gimli.controller('IssuesController', ['$scope', '$routeParams', 'GimliApiService',
  function($scope, $routeParams, gimliApi) {
    $scope.issues = [];
    params = $routeParams;

    $scope.owner = $routeParams.owner;
    $scope.repo  = $routeParams.repo;

    gimliApi.getIssues({
        owner: params.owner,
        repo: params.repo
      },
      function(data, status, headers, config) {
        $scope.issues = data;
      }
    );
  }
]);

gimli.controller('IssueController', ['$scope', '$routeParams', 'GimliApiService',
  function($scope, $routeParams, gimliApi){
    $scope.issue = {};
    params = $routeParams;

    gimliApi.getIssue({
        owner: params.owner,
        repo: params.repo,
        id: params.id
      },
      function(data, status, headers, config) {
        $scope.issue = data;
      }
    );
  }
]);

// Document ready
var client = null;
$(function() {
  client = new Faye.Client('http://localhost:3000/faye');
});
