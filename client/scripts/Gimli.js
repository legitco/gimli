var gimli = angular.module('gimli', ['hc.marked', 'ui.router', 'faye']);

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
