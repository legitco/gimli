var gimli = angular.module('gimli', ['ngRoute']);

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

gimli.controller('IssuesController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $scope.issues = [];
    params = $routeParams;

    $scope.owner = $routeParams.owner;
    $scope.repo  = $routeParams.repo;

    $http({ method: 'GET', url: '/api/' + params.owner + '/' + params.repo + '/issues' })
      .success(function(data, status, headers, config) {
        $scope.issues = data;
      }
    );
  }
]);

gimli.controller('IssueController', ['$scope', '$http', '$routeParams',
  function($scope, $http, $routeParams){
    $scope.issue = {};
    params = $routeParams;

    $http({ method: 'GET', url: '/api/' + params.owner + '/' + params.repo + '/issue/' + params.id })
      .success(function(data, status, headers, config) {
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
