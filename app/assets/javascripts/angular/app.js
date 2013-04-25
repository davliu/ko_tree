'use strict';
var TreeApp = angular.module('TreeApp', []);

TreeApp.controller('ProjectsController', ['$scope', '$http', function ($scope, $http) {
  $scope.projects = [];

  $http.get('projects.json/?grouping=Angular').then(function(response) {
    $scope.projects = response.data;
  });

  $scope.submitProject = function() {
    $('#angular-projects-form').serialize();

    if ($scope.projectText != null && $scope.projectText.length > 0) {
      $.ajax({
        url: 'projects.json',
        data: $('#angular-projects-form').serialize(),
        type: 'POST',
        success: function(newProject) {
          $scope.projectText = "";
          $scope.projects.push(newProject);
          $scope.$apply();
        },
        error: function(response) {
        }
      });
    };
  };

  $scope.deleteProject = function(index) {
    var person = $scope.projects[index];
    $.ajax({
      url: 'projects/' + person.id + '.json',
      type: 'DELETE'
    }).done(function() {
      $scope.projects.splice(index, 1);
      $scope.$apply();
    });
  };
}]);
