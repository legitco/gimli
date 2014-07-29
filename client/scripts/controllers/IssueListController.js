angular.module('gimli').controller('IssueListController', ['$scope', '$stateParams', 'GimliApiService',
  function($scope, $stateParams, GimliApiService) {
    $scope.issues = [];
    params = $stateParams;

    $scope.owner = $stateParams.owner;
    $scope.repo  = $stateParams.repo;

    GimliApiService.getIssues({
        owner: params.owner,
        repo: params.repo
      })
      .then(function(res) {
        $scope.issues = res.data;
      });
  }
]);
