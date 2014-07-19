angular.module('gimli').service('GimliApiService', ['$q', '$http', function(q, $http) {
  this.getIssues = function(opts) {
    return $http.get('/api/' + opts.owner + '/' + opts.repo + '/issues');
  }

  this.getIssue = function(opts) {
    return $http.get('/api/' + opts.owner + '/' + opts.repo + '/issue/' + opts.id);
  }

  this.getIssueComments = function(opts) {
    return $http.get('/api/' + opts.owner + '/' + opts.repo + '/issue/' + opts.id + '/comments');
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
