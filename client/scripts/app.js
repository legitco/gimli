var angular = angular || {};
var gimli = angular.module('gimli', []);

gimli.controller('IssuesController', ['$scope', function($scope){
  $scope.issues = [
    {id:1, title: "I am an issue"},
    {id:2, title: "I have an issue"}
  ];
}]);
