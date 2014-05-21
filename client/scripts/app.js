var gimli = angular.module('gimli', []);

gimli.controller('IssuesController', ['$scope', function($scope){
  // $scope.issues = [
  //   {id:1, title: "I am an issue"},
  //   {id:2, title: "I have an issue"}
  // ];
  $scope.issues = [];
}]);

// Document ready
var client = null;
$(function() {
  client = new Faye.Client('http://localhost:3000/faye');
});
