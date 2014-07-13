var gimli = angular.module('gimli', ['hc.marked', 'ui.router', 'faye']);

// TODO: FIX HARDCODED THINGS
gimli.factory('Faye', ['$faye', function ($faye) {
    return $faye("/faye");
  }
]);

gimli.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});


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

  /**
   * Posts a comment
   * @param opts
   *    owner
   *    repo
   *    id
   *    message
   * @return promise
   */
  this.postComment = function(opts) {
    return $http.post(
        '/api/' + opts.owner + '/' + opts.repo + '/issue/' + opts.id + '/comments',
        {body: opts.message}
    );
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
    var params = $stateParams;
    var scope = $scope;
    scope.draftIssueComment = "Test message";
    var channel = '/'+params.owner+'/'+params.repo+'/issue/'+params.id;
    $scope.submitComment = function() {
      // TODO: post!
      GimliApiService.postComment({
        owner: params.owner,
        repo: params.repo,
        id: params.id,
        message: $scope.draftIssueComment
      }).success(function(){
        console.log("Successfully posted.")
        $scope.draftIssueComment = "";
      }).error(function(){
        console.log("failed to post?");
      });

    };

    Faye.subscribe(channel, function cb(comment){
      $scope.comments[comment.id] = comment;
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
            // lodash?
            $scope.comments = {};
            data.forEach(function(comment) {
              $scope.comments[comment.id] = comment;
            });
          });
        }
      }
    );
  }
]);
