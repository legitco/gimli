angular.module('gimli').service('GimliApiService', ['$q', '$http', function(q, $http) {
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
