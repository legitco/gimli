angular.module('gimli').controller('IssueController', ['$scope', '$stateParams', '$sce', 'Faye', 'GimliApiService',
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
