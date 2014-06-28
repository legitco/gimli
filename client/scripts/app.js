var gimli = angular.module('gimli', ['hc.marked', 'ui.router']);

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

gimli.config(function($locationProvider, markedProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);

  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function (code) {
      return hljs.highlightAuto(code).value;
    }
  });

  $urlRouterProvider.otherwise("/404");

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: 'views/home'
    })
    .state('issues', {
      url: '/:owner/:repo/issues',
      templateUrl: '/views/issues',
      controller: 'IssuesController'
    })
    .state('issue', {
      url: '/:owner/:repo/issue/:id',
      templateUrl: '/views/issue',
      controller: 'IssueController'
    })
    .state('404', {
      url: '/404',
      templateUrl: '/views/404'
    })
  ;

});

gimli.controller('IssuesController', ['$scope', '$stateParams', 'GimliApiService',
  function($scope, $stateParams, GimliApiService) {
    $scope.issues = [];
    params = $stateParams;

    $scope.owner = $stateParams.owner;
    $scope.repo  = $stateParams.repo;

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

gimli.controller('IssueController', ['$scope', '$stateParams', '$sce', 'GimliApiService',
  function($scope, $stateParams, $sce, GimliApiService){
    $scope.issue = {};
    params = $stateParams;

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
