var gimli = angular.module('gimli', ['ngRoute']);

gimli.service('GimliApiService', ['$q', '$http', function(q, $http) {
  this.getIssues = function(opts, onSuccess) {
    $http({
        method: 'GET',
        url: '/api/' + opts.owner + '/' + opts.repo + '/issues'
      })
      .success(onSuccess);
  }

  this.getIssue = function(opts, onSuccess) {
    $http({
        method: 'GET',
        url: '/api/' + opts.owner + '/' + opts.repo + '/issue/' + opts.id
      })
      .success(onSuccess);
  }

  this.getRenderedBody = function(opts, onSuccess) {
    $http.post(
        '/api/' + opts.owner + '/' + opts.repo + '/markdown',
        opts.data,
        { headers: { 'content-type': 'application/x-markdown' } }
      )
      .success(onSuccess);
  }
}]);

gimli.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: '/views/home'
    })
    .when('/:owner/:repo/issues', {
      templateUrl: '/views/issues',
      controller: 'IssuesController'
    })
    .when('/:owner/:repo/issue/:id', {
      templateUrl: '/views/issue',
      controller: 'IssueController'
    })
    .when('/404', {
      templateUrl: '/views/404'
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

gimli.controller('IssueController', ['$scope', '$routeParams', '$sce', 'GimliApiService',
  function($scope, $routeParams, $sce, gimliApi){
    $scope.issue = {};
    params = $routeParams;

    gimliApi.getIssue({
        owner: params.owner,
        repo: params.repo,
        id: params.id
      },
      function(data, status, headers, config) {
        $scope.issue = data;

        // TODO (svincent): Refactor to avoid the uneccessary callback pyramid.
        gimliApi.getRenderedBody({
          owner: params.owner,
          repo: params.repo,
          data: $scope.issue.body
        }, function(data, status, headers, config) {
          $scope.issue.renderedBody = $sce.trustAsHtml(data);
        });
      }
    );
  }
]);

// Document ready
var client = null;
$(function() {
  client = new Faye.Client('http://localhost:3000/faye');
});
