var gimli = angular.module('gimli', ['hc.marked', 'ui.router', 'faye']);

// TODO: FIX HARDCODED THINGS
gimli.factory('Faye', ['$faye', function ($faye) {
    return $faye("http://localhost:3000/faye");
  }
]);

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
      url: '/{owner:[\\w-]+}/{repo:[\\w-]+}/issues',
      templateUrl: '/views/issues',
      controller: 'IssueListController'
    })
    .state('issue', {
      url: '/{owner:[\\w-]+}/{repo:[\\w-]+}/issue/:id',
      templateUrl: '/views/issue',
      controller: 'IssueController'
    })
    .state('nested', {
      url: '/nested',
      templateUrl: '/views/demo-nested',
      controller: function($scope, $state){
        $scope.$state = $state;
      }
    })
    .state('nested.child1', {
      parent: 'nested',
      url: '/child1',
      templateUrl: '/views/demo-nested-child1'
    })
    .state('404', {
      url: '/404',
      templateUrl: '/views/404'
    })
  ;
});

gimli.controller('IssueListController', ['$scope', '$stateParams', 'GimliApiService',
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

gimli.controller('IssueController', ['$scope', '$stateParams', '$sce', 'Faye', 'GimliApiService',
  function($scope, $stateParams, $sce, Faye, GimliApiService){
    params = $stateParams;
    $scope.fayeTestMessage = "Test message";
    var channel = '/'+params.repo+'/'+params.owner+'/issue/'+params.id;
    $scope.fayeTestSubmit = function() {
      console.log("submit");
      Faye.publish(channel, $scope.fayeTestMessage);
    };
    Faye.subscribe(channel, function cb(comment){
      alert(comment); // TODO:  do something with this.
    });
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
