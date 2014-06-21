var gimli = angular.module('gimli', ['ngRoute', 'hc.marked']);

gimli.service('GimliApiService', ['$q', '$http', function(q, $http) {
  this.getIssues = function(opts, onSuccess) {
    $http.get('/api/' + opts.owner + '/' + opts.repo + '/issues')
      .success(onSuccess);
  }

  this.getIssue = function(opts, onSuccess) {
    $http.get('/api/' + opts.owner + '/' + opts.repo + '/issue/' + opts.id)
      .success(onSuccess);
  }

  this.getIssueComments = function(opts, onSuccess) {
    $http.get('/api/' + opts.owner + '/' + opts.repo + '/issue/' + opts.id + '/comments')
      .success(onSuccess);
  }
}]);

gimli.config(function($routeProvider, $locationProvider, markedProvider) {
  $locationProvider.html5Mode(true);

  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

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
  function($scope, $routeParams, GimliApiService) {
    $scope.issues = [];
    params = $routeParams;

    $scope.owner = $routeParams.owner;
    $scope.repo  = $routeParams.repo;

    GimliApiService.getIssues({
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
  function($scope, $routeParams, $sce, GimliApiService){
    $scope.issue = {};
    params = $routeParams;

    GimliApiService.getIssue({
        owner: params.owner,
        repo: params.repo,
        id: params.id
      },
      function(data, status, headers, config) {
        $scope.issue = data;

        // TODO (svincent): Refactor to avoid the uneccessary callback pyramid
        if (data.comments) {
          GimliApiService.getIssueComments({
            owner: params.owner,
            repo: params.repo,
            id: params.id
          }, function(data, status, headers, config) {
            $scope.comments = data;
          });
        }
      }
    );
  }
]);

// Document ready
var client = null;
$(function() {
  client = new Faye.Client('http://localhost:3000/faye');
});
