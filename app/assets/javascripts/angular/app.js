'use strict';

function ProjectsController($scope, $http) {
  $scope.projects = [];
  $scope.projects = $http.get('projects.json').then(function(response) {
    console.log(response.data);
    return response.data;
  });
}
