angular.module('gimli').controller('IssueController', ['$scope', '$stateParams', '$sce', 'Faye', 'GimliApiService',
  function($scope, $stateParams, $sce, Faye, GimliApiService){
    var params = $stateParams;
    var scope = $scope;
    scope.draftIssueComment = "Test message";
    scope.disableInput = false;
    scope.errorMessage = "";

    var channel = '/'+params.owner+'/'+params.repo+'/issue/'+params.id;
    $scope.submitComment = function() {
      scope.disableInput = true;
      return;
      GimliApiService.postComment({
          owner: params.owner,
          repo: params.repo,
          id: params.id,
          message: $scope.draftIssueComment
        })
        .success(function(){
          scope.disableInput = false;
          $scope.draftIssueComment = "";
        })
        .error(function(){
          scope.disableInput = false;
          if (console && console.log) {
            console.log("failed to post");
          }
        })
      ;
    };

    Faye.subscribe(channel, function cb(comment){
      $scope.comments[comment.id] = comment;
    });

    GimliApiService.getIssue({
        owner: params.owner,
        repo: params.repo,
        id: params.id
      })
      .then(function(res) {
        $scope.issue = res.data;

        if (res.data.comments !== 0) {
          return GimliApiService.getIssueComments({
            owner: params.owner,
            repo: params.repo,
            id: params.id}
          );
        }
      })
      .then(function(res) {
        $scope.comments = {};

        if(res.data) {
          res.data.forEach(function(comment) {
            $scope.comments[comment.id] = comment;
          });
        }
      })
      .catch(function(){
        if (console && console.log) {
          console.log("failed to retrieve comments");
        }
      });
  }
]);
